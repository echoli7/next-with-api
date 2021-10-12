// 根据请求重定向到要 preview 的路由, 如果那个路由设置了 preview, 则会展示 preview 数据
import { NextApiResponse } from 'next'

export default (req, res: NextApiResponse) => {
    res.setPreviewData({})
    res.redirect(req.query.route)
}