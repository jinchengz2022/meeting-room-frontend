import { message } from "antd";
import axios, { AxiosRequestConfig } from "axios";

interface PendingTask {
  config: AxiosRequestConfig;
  res: Function;
}

export interface RegisterUser {
  username: string;
  password: string;
  email: string;
  captcha: string;
  nickName?: string;
}

export interface LoginUser {
  username: string;
  password: string;
}

export interface QueryList {
  pageNumber?: number;
  pageSize?: number;
  email?: string;
  username?: string;
  nickName?: string;
  phoneNumber?: string;
  all?: boolean;
}

export interface QueryMeetingRoomList {
  pageNumber: number;
  pageSize: number;
  capacity?: string;
  name?: string;
  position?: string;
}

export interface QueryBookingList {
  pageNumber: number;
  pageSize: number;
  roomName?: string;
  userName?: string;
  position?: string;
}

export interface ListResponse {
  id: number;
  updateTime: string;
  createTime: string;
  email: string;
  isFrozen: boolean;
  nickName: string;
  phoneNumber: string;
  username: string;
  headPic: any;
}

export interface BookingListResponse {
  id: number;
  roomName: string;
  userName: string;
  people: any[];
  startTime: Date;
  endTime: Date;
  position: string;
  roomId: number;
  status: string;
}

export interface UpdateUserInfoRequest {
  id: number;
  username: string;
  email: string;
  captcha: string;
  nickName?: string;
  headPic?: any;
}

export interface CreateMeetingRoomInfoRequest {
  capacity: string;
  name: string;
  position: string;
}

export interface UpdateMeetingRoomInfoRequest
  extends CreateMeetingRoomInfoRequest {
  id: number;
}

export interface ReserveRoomRequest {
  roomName: string;
  id: number;
  position: string;
  startTime: Date;
  endTime: Date;
}

const axiosInstance = axios.create({
  baseURL: "http://47.109.206.58/api",
  timeout: 3000,
});

axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("access_token");

  if (accessToken) {
    config.headers.Authorization = "Bearer " + accessToken;
  }

  return config;
});

let refreshing = false;
const queue: PendingTask[] = [];

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // 请求未发送成功
    if (!error.response) {
      return Promise.reject(error);
    }

    let { data, config } = error.response;

    if (refreshing) {
      return new Promise((res) => {
        queue.push({ config, res });
      });
    }

    if (data?.code === 401 && !config.url.includes("/user/refresh")) {
      refreshing = true;

      const res = await refreshToken();

      refreshing = false;

      if (res.status === 200 || res.status === 201) {
        queue.forEach(({ config, res }) => {
          res(axiosInstance(config));
        });

        return axiosInstance(config);
      } else {
        message.error(res?.data);

        setTimeout(() => {
          window.location.href = "login";
        }, 1500);
      }
    } else {
      return error.response;
    }
  }
);

async function refreshToken() {
  const res = await axiosInstance.get("/user/login", {
    params: { token: localStorage.getItem("refresh_token") },
  });

  localStorage.setItem("access_token", res.data.data.accessToken || "");
  localStorage.setItem("refresh_token", res.data.data.refreshToken || "");
  localStorage.setItem("userInfo", JSON.stringify(res.data.userInfo));

  return res;
}

export const login = async (params: LoginUser) => {
  const res = await axiosInstance.post("/user/login", params);

  if (res.data.data.accessToken) {
    localStorage.setItem("access_token", res.data.data.accessToken);
    localStorage.setItem("userInfo", JSON.stringify(res.data.data.userInfo));
  }

  return res;
};

export const adminLogin = async (params: LoginUser) => {
  const res = await axiosInstance.post("/user/adminLogin", params);

  if (res.data.data.accessToken) {
    localStorage.setItem("access_token", res.data.data.accessToken);
    localStorage.setItem("userInfo", JSON.stringify(res.data.data.userInfo));
  }

  return res;
};

export const register = async (params: RegisterUser) => {
  return await axiosInstance.post("/user/register", params);
};

export const list = async (params: QueryList) => {
  return await axiosInstance.get(`/user/list`, {
    params,
  });
};

export const getUserInfo = async (params: { id: number }) => {
  return await axiosInstance.get(`/user/info`, {
    params,
  });
};

export const updateUserInfo = async (params: UpdateUserInfoRequest) => {
  return await axiosInstance.post("/user/update", params);
};

export const upload = async (file: any) => {
  return await axiosInstance.post("/user/upload", file);
};

export const freezeUser = async (params: { id: number }) => {
  return await axiosInstance.get(`/user/freeze`, {
    params,
  });
};

export const unFreezeUser = async (params: { id: number }) => {
  return await axiosInstance.get(`/user/unFreeze`, {
    params,
  });
};

export const meetingRoomList = async (params: QueryMeetingRoomList) => {
  return await axiosInstance.get(`/meeting-room/list`, {
    params,
  });
};

export const createMeetingRoomInfo = async (
  params: CreateMeetingRoomInfoRequest
) => {
  return await axiosInstance.post(`/meeting-room/CreateMeetingRoom`, params);
};

export const updateMeetingRoomInfo = async (
  params: UpdateMeetingRoomInfoRequest
) => {
  return await axiosInstance.post(`/meeting-room/UpdateMeetingRoom`, params);
};

export const deleteMeetingRoom = async (params: any) => {
  return await axiosInstance.get(`/meeting-room/DeleteMeetingRoom`, { params });
};

export const getMeetingRoom = async (params: { id: number }) => {
  return await axiosInstance.get(`/meeting-room/GetMeetingRoom`, { params });
};

export const bookingList = async (params: QueryBookingList) => {
  return await axiosInstance.get(`/booking/list`, {
    params,
  });
};

export const reserveRoom = async (params: ReserveRoomRequest) => {
  return await axiosInstance.post(`/booking/add`, params);
};

export const reserveApply = async (roomId: number) => {
  return await axiosInstance.get(`/booking/apply/${roomId}`);
};

export const reserveReject = async (roomId: number) => {
  return await axiosInstance.get(`/booking/reject/${roomId}`);
};

export const reserveUnbind = async (roomId: number) => {
  return await axiosInstance.get(`/booking/unbind/${roomId}`);
};
