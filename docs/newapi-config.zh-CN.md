# NewAPI 配置示例

`sk-epay` 默认采用现代接口路径，不使用 `.php` 风格 URL；但请求参数、签名算法和响应结构仍保持 EPay / NewAPI 可识别格式。

## 网关参数

- API 地址：`https://你的域名/api/pay`
- 订单查询：`https://你的域名/api/query`
- 异步通知接收：`https://你的域名/api/notify`
- 同步跳转页：`https://你的域名/api/return`
- 商户 PID：`1000001`
- 商户 KEY：`demo_merchant_key_please_change`
- 签名方式：`MD5`

## 典型下单字段

```txt
pid=1000001
type=alipay
out_trade_no=ORDER202604150001
notify_url=https://merchant.example.com/pay/notify
return_url=https://merchant.example.com/pay/return
name=测试商品
money=88.00
sign=md5签名结果
sign_type=MD5
```

## 签名规则

1. 过滤空值以及 `sign`、`sign_type` 字段。
2. 按参数名 ASCII 字典序升序排序。
3. 拼接为 `key=value&key=value`。
4. 末尾直接追加商户密钥 `KEY`。
5. 对整串做 `MD5`，输出 32 位小写。

## 查询接口示例

```txt
GET /api/query?pid=1000001&out_trade_no=ORDER202604150001&sign=xxxx&sign_type=MD5
```
