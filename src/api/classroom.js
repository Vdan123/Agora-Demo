import { useAxios } from "@vueuse/integrations/useAxios";
import instance from './index'
import qs from 'qs';
import { transformRequestData } from "@/utils/tool";

export const getRoomToken = ({ course_no }) => {
  return instance({
    url: `/live/${ course_no }/token`,
    method: 'GET',
    notNotice: true
  })
}


/**
 * @params
 * title
 * start_time
 * end_time
 * cost
 * tags
 * students
 * attachments
 * **/
export const setTemporaryCourse = ({ data, course_no }) => {
  return useAxios(`/course/${ course_no }`, {
    method: 'POST',
    data: qs.stringify(transformRequestData(data)),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }, instance)
}


/**
 * @params
 * title
 * description
 * cost
 * tags
 * courses
 * **/
export const setPackCourse = ({ data, pack_no }) => {

  return useAxios(`/course/pack/${ pack_no }`, {
    method: 'POST',
    data,
    headers: {
      "Content-Type": "multipart/form-data"
    }
  }, instance)
}


/**
 * @params
 * const params = {
 *   page: '',
 *   per_page: '',
 *   start_time: '',
 *   end_time: ''
 * }
 * **/
export const getMyCourse = params => {
  return instance({
      method: 'GET',
      url: '/course/my',
      params,
      notNotice: true
    }
  )
}


export const deleteMyCourse = course_no => {
  return useAxios(`/course/${ course_no }`, {
    method: 'delete',
  }, instance)
}


export const getCourseInfo = course_no => {
  return useAxios(`/course/${ course_no }`, {
    notNotice: true
  }, instance)
}

export const getMyPackage = params => {
  return instance({
    url: '/course/my-packs',
    params,
    notNotice: true
  })
}


export const getMyPackDetails = pack_no => {
  return instance({
    url: `/course/pack/${ pack_no }`,
    method: 'GET',
    notNotice: true
  })
}

export const cancelCourse = course_no => {
  return useAxios(`/course/${ course_no }`, {
    method: 'PUT',
  }, instance)
}

export const uploadFile = formData => {
  return useAxios('/file', {
    method: 'POST',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },

  }, instance)
}
