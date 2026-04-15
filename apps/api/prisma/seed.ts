import {
  ChannelMode,
  ChannelProvider,
  ChannelStatus,
  PaymentType,
  PrismaClient,
  UserStatus,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Admin@123456", 10);

  await prisma.adminUser.upsert({
    where: { username: "admin" },
    update: { displayName: "系统管理员", passwordHash, status: UserStatus.ACTIVE },
    create: {
      username: "admin",
      displayName: "系统管理员",
      passwordHash,
      status: UserStatus.ACTIVE,
    },
  });

  const merchant = await prisma.merchant.upsert({
    where: { pid: "1000001" },
    update: {},
    create: {
      name: "演示商户",
      pid: "1000001",
      apiKey: "demo_merchant_key_please_change",
      callbackWhitelist: [],
      allowedPaymentTypes: [PaymentType.ALIPAY, PaymentType.WXPAY],
      status: UserStatus.ACTIVE,
    },
  });

  const channel = await prisma.paymentChannel.upsert({
    where: { code: "wxpay_direct_default" },
    update: {},
    create: {
      code: "wxpay_direct_default",
      name: "微信支付官方直连默认通道",
      provider: ChannelProvider.WECHAT_OFFICIAL,
      supportedTypes: [PaymentType.WXPAY],
      supportedModes: [ChannelMode.H5, ChannelMode.JSAPI, ChannelMode.NATIVE],
      status: ChannelStatus.ENABLED,
      config: {
        mchId: "",
        apiV3Key: "",
        certSerialNo: "",
      },
    },
  });

  const alipayChannel = await prisma.paymentChannel.upsert({
    where: { code: "alipay_direct_default" },
    update: {},
    create: {
      code: "alipay_direct_default",
      name: "支付宝官方直连默认通道",
      provider: ChannelProvider.ALIPAY_OFFICIAL,
      supportedTypes: [PaymentType.ALIPAY],
      supportedModes: [ChannelMode.H5],
      status: ChannelStatus.ENABLED,
      config: {
        gateway: "https://openapi.alipay.com",
      },
    },
  });

  await prisma.merchantUser.upsert({
    where: {
      merchantId_username: {
        merchantId: merchant.id,
        username: "merchant_admin",
      },
    },
    update: { displayName: "演示商户管理员", passwordHash },
    create: {
      merchantId: merchant.id,
      username: "merchant_admin",
      displayName: "演示商户管理员",
      passwordHash,
      status: UserStatus.ACTIVE,
    },
  });

  await prisma.merchantChannelBinding.upsert({
    where: {
      merchantId_channelId: {
        merchantId: merchant.id,
        channelId: channel.id,
      },
    },
    update: {},
    create: {
      merchantId: merchant.id,
      channelId: channel.id,
      status: ChannelStatus.ENABLED,
      credentialConfig: {
        appId: "",
        privateKeyPem: "",
        certPem: "",
      },
    },
  });

  await prisma.merchantChannelBinding.upsert({
    where: {
      merchantId_channelId: {
        merchantId: merchant.id,
        channelId: alipayChannel.id,
      },
    },
    update: {},
    create: {
      merchantId: merchant.id,
      channelId: alipayChannel.id,
      status: ChannelStatus.ENABLED,
      credentialConfig: {
        appId: "",
        privateKeyPem: "",
        alipayPublicKey: "",
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
