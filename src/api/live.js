import instance from './index'
import qs from "qs";


/** 同步直播状态
 * ready-准备中
 * start-直播中
 * finish-已结束
 * close-已关闭
 * **/
export const setLiveStatus = ({ course_no, data }) => {
  return instance({
    url: `/live/${course_no}/sync-status`,
    method: 'POST',
    data: qs.stringify(data),
    notNotice: true
  })
}
