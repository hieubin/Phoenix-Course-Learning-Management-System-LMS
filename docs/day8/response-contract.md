# API response contract

All JSON success responses use this shape:

```json
{
  "success": true,
  "data": {},
  "message": "OK"
}
```

All JSON error responses use this shape:

```json
{
  "success": false,
  "data": null,
  "message": "Reason"
}
```

DELETE endpoints keep HTTP `204 No Content`, so they intentionally return no body.