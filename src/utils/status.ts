export const reserveStatusFunction = (state: string) => {
    const status: any = {
        'waiting': '空闲',
        'done': '成功',
        'reject': '失败',
        'applying': '申请中'
    }

    return status?.[state] ?? '空闲'
}