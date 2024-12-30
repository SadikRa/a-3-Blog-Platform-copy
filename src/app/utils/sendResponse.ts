import { Response } from 'express'

type TSuccessResponse<T> = {
  status?: boolean
  success: boolean
  statusCode: number
  message: string
  data: T | T[] | null
}

const sendResponse = <T>(res: Response, data: TSuccessResponse<T>) => {
  res.status(data.statusCode).json({
    status: true,
    success: data.success,
    statusCode: data.statusCode,
    message: data.message,
    data: data.data,
  })
}

export default sendResponse