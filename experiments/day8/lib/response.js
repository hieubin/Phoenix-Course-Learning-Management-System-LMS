export function sendSuccess(res, data, status = 200, message = 'OK') {
  return res.status(status).json({ success: true, data, message });
}