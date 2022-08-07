import { useEffect, useRef, useState } from "react";
import { Header } from "../../components/main/common/header.com";
import styles from "./home.module.less";
import { useObserver } from "mobx-react";
import { Web3Head } from "../../components/main/common/head.com";
import { WalletStore } from "../../stores/main/wallet.store";
import { useRouter } from "next/router";
import { Trans } from "@lingui/react";
import { OfferStore } from "../../stores/main/offer.store";
import useStore from "../../stores/useStore";
import { t } from "@lingui/macro";
import {
  Button,
  Dropdown,
  Form,
  Input,
  Menu,
  message,
  Select,
  Steps,
  StepsProps,
  Tooltip,
} from "antd";
import { NFTStore } from "../../stores/main/nfts.store";

import {
  QuestionCircleOutlined,
  LockOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { ItemType } from "antd/lib/menu/hooks/useItems";

export default function Offer(props) {
  const offerStore = useStore(OfferStore);
  const nftStore = useStore(NFTStore);

  const walletStore = useStore(WalletStore);
  const router = useRouter();
  const { id } = router.query;
  const [accepting, setAccepting] = useState(false);
  const [ensList, setEnsList] = useState<ItemType[]>([]);

  useEffect(() => {
    if (id) {
      offerStore.offer.id = id as string;
      const loading = message.loading("loading");
      offerStore.getOffer();
      loading();
      nftStore.getNFTS();
    }
    (async () => {
      const walletInfo = await walletStore.getWalletInfo();
      offerStore.form.Baddress = walletInfo.account;
      offerStore.form.Bname = walletInfo.ens;

      const ens = walletInfo.ens;
      const bit = walletInfo.bit;
      const items = [];
      if (ens) {
        items.push({
          label: ens,
          key: ens,
        });
      }
      if (bit) {
        items.push({
          label: bit,
          key: bit,
        });
      }
      setEnsList(items);
    })();
  }, [router.query.id]);
  const formItemLayout = {
    labelCol: { span: 12 },
    wrapperCol: { span: 12 },
  };
  const menu = (
    <Menu
      onClick={(e) => {
        offerStore.form.Bname = e.key;
      }}
      items={[
        {
          disabled: true,
          label:
            ensList.length > 0
              ? "please choose .eth or .bit"
              : "no .eth or .bit bind",
          key: -1,
        },
        ...ensList,
      ]}
    />
  );
  return useObserver(() => {
    return (
      <div className={styles.upgrade}>
        <div className={styles.content}>
          <svg
            width="47"
            height="47"
            viewBox="0 0 47 47"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={styles.close}
            onClick={() => {
              router.push(`/?id=${offerStore.offer.id}`);
            }}
          >
            <rect width="47" height="47" rx="10" fill="#FAE1E6" />
            <path
              d="M26.8493 23.5L32.0456 18.3037C32.9704 17.3789 32.9704 15.8794 32.0456 14.9546C31.1207 14.0298 29.6213 14.0298 28.6965 14.9546L23.5002 20.1509L18.3039 14.9546C17.3791 14.0298 15.8797 14.0298 14.9549 14.9546C14.03 15.8794 14.03 17.3789 14.9549 18.3037L20.1511 23.5L14.9549 28.6963C14.03 29.6211 14.03 31.1205 14.9549 32.0454C15.4173 32.5078 16.0233 32.739 16.6294 32.739C17.2355 32.739 17.8415 32.5078 18.3039 32.0454L23.5002 26.8491L28.6965 32.0454C29.1589 32.5078 29.765 32.739 30.371 32.739C30.9771 32.739 31.5831 32.5078 32.0456 32.0454C32.9704 31.1205 32.9704 29.6211 32.0456 28.6963L26.8493 23.5Z"
              fill="black"
              className={styles.close_x}
            />
          </svg>
          {offerStore.is404 ? (
            <div className={styles.Page1}>
              <div className={styles.Page_inner}>
                <div className={styles.s404}>{t`不存在的求婚`}</div>
              </div>
            </div>
          ) : (
            <div className={styles.Page1}>
              <div className={styles.Page_inner}>
                <Header hideAll={true} />
                <h1 className={styles.title}>{offerStore.offer.Acomment}</h1>
                <h2 className={styles.subInfo}>
                  <p>
                    <Trans id="一份来自 " />
                    {offerStore.offer.Aname}
                    <Trans id=" 对你爱的承诺。" />
                  </p>
                  <p>
                    <Trans id="如果你答应他的，这份情书将被永久性刻在区块链上。" />
                  </p>
                  <p>
                    <Trans id="同时，你们俩将分别收到预示今生永恒的NFT。" />
                  </p>
                  <p>
                    <Trans id="现在，你需要做的就是签名赶紧让他知道。" />
                  </p>
                </h2>
                <h2 className={styles.subInfo2}>
                  <p className={styles.subInfoMain}>
                    <div>
                      <img
                        src="/logo.png"
                        title="marry3"
                        className={styles.logo}
                      />
                    </div>
                    <Trans id="基于 ERC520 开发" />
                    <a
                      href="https://github.com/marryinweb3/erc520"
                      style={{ marginLeft: "10px" }}
                    >
                      Github
                    </a>
                  </p>
                </h2>
                <div className={styles.right}>
                  <img
                    src="/heart_xin.png"
                    className={styles.xin}
                    title="xin"
                  />
                  <Form layout={"vertical"} className={styles.mainForm}>
                    <Form.Item
                      label={
                        <span>
                          {t`NFT PMP`}
                          <Tooltip
                            title={t`选择的 NFT 头像将被印到 Marry3 Certificate NFT 中`}
                          >
                            <QuestionCircleOutlined
                              style={{ marginLeft: "5px" }}
                            />
                          </Tooltip>
                        </span>
                      }
                    >
                      <Select
                        placeholder={t`选择一个NFT作为头像`}
                        value={offerStore.form.Bcover}
                        onChange={(e) => {
                          if (e == "-100") {
                            window.open("https://myfirstnft.info/");
                            offerStore.form.Bcover = "";
                          } else {
                            offerStore.form.Bcover = e;
                          }
                        }}
                      >
                        {nftStore.nfts.map((nft, i) => {
                          return (
                            <Select.Option
                              key={i}
                              value={nft.cached_file_url || nft.metadata?.image}
                            >
                              <img
                                src={nft.cached_file_url || nft.metadata?.image}
                                title="nft"
                                style={{ width: "25px", height: "25px" }}
                              />
                              <span style={{ paddingLeft: "10px" }}>
                                {nft.metadata?.name}
                              </span>
                            </Select.Option>
                          );
                        })}
                        <Select.Option key="any" value="-100">
                          <span style={{ paddingLeft: "10px" }}>
                            <Trans id="还没有NFT？MFNFT（免费）" />
                          </span>
                        </Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item label={t`your name`}>
                      <Input.Group
                        compact
                        style={{
                          display: "inline-block",
                          verticalAlign: "8px",
                        }}
                      >
                        <Input
                          value={offerStore.form.Bname}
                          placeholder="your ens name or nick"
                          onChange={async (e) => {
                            offerStore.form.Bname = e.target.value;
                          }}
                          style={{ width: "calc(100% - 140px)" }}
                        />
                        <Dropdown overlay={menu}>
                          <Button style={{ width: "40px" }}>
                            <DownOutlined />
                          </Button>
                        </Dropdown>
                        <Select
                          value={offerStore.form.Bsex}
                          onChange={(e) => (offerStore.form.Bsex = e)}
                          style={{ width: "100px" }}
                        >
                          <Select.Option value={0}>
                            <Trans id="Male" />
                          </Select.Option>
                          <Select.Option value={1}>
                            <Trans id="Female" />
                          </Select.Option>
                          <Select.Option value={2}>
                            <Trans id="X" />
                          </Select.Option>
                        </Select>
                      </Input.Group>
                    </Form.Item>

                    {walletStore.walletInfo.account ? (
                      <Button
                        onClick={async () => {
                          setAccepting(true);
                          try {
                            await offerStore.accept();
                          } catch (e) {
                            message.error(e);
                          }

                          setAccepting(false);
                        }}
                        disabled={offerStore.offer.status !== 0}
                        type="primary"
                        loading={accepting}
                        style={{ width: "100%" }}
                        className="shake-little"
                      >
                        {offerStore.offer.status == 0 ? (
                          <Trans id="签名回复对方" />
                        ) : (
                          <Trans id="已回复，请通知对方 Mint" />
                        )}
                      </Button>
                    ) : (
                      <Button
                        onClick={async () => {
                          walletStore.connect();
                        }}
                        type="primary"
                        style={{ width: "100%" }}
                      >
                        <Trans id="Connect Wallet" />
                      </Button>
                    )}
                    <Steps
                      current={offerStore.stepStatus()}
                      progressDot={customDot}
                      className={styles.steps}
                      responsive={false}
                    >
                      <Steps.Step title={t`对方向你发起配对请求`} />
                      <Steps.Step title={t`等待你签名配对`} />
                      <Steps.Step title={t`等待对方 Mint SBTs`} />
                    </Steps>
                    {!offerStore.form.Baddress ? (
                      <div className={styles.noconnectWrapper}>
                        <div
                          className={styles.noconnect}
                          onClick={() => {
                            walletStore.connect();
                          }}
                        >
                          <LockOutlined style={{ fontSize: "25px" }} /> <br />
                          <Trans id="连接钱包启动 DAPP" />
                        </div>
                      </div>
                    ) : null}
                  </Form>
                </div>
              </div>
            </div>
          )}

          {/* <Form {...formItemLayout} style={{ margin: "50px auto" }}>
              <Form.Item label="状态">
                {offer.status == 0 ? <span>wait accept</span> : null}
                {offer.status == 1 ? <span>wait mint</span> : null}
                {offer.status == 2 ? <span>minted</span> : null}
              </Form.Item>
              <Form.Item label="price">
                {marryStore.marryPriceFormated} {web3Config.ethName}
              </Form.Item>
              <Form.Item
                wrapperCol={{ span: 12, offset: 12 }}
                labelCol={{ span: 12 }}
              >
                {offer.Baddress == account.toLowerCase() ? (
                  <Button
                    onClick={accept}
                    disabled={offer.status !== 0}
                    type="primary"
                  >
                    {offer.status === 1 ? "sign success" : "SIGN to accept offer "}
                  </Button>
                ) : null}
                {offer.Aaddress == account.toLowerCase() &&
                  (offer.status == 1 ? (
                    <Button
                      onClick={mint}
                      disabled={offer.status !== 1}
                      type="primary"
                      loading={minting}
                    >
                      Mint
                    </Button>
                  ) : offer.status == 2 ? (
                    <Button disabled type="primary">
                      Minted
                    </Button>
                  ) : (
                    <Button loading={true} type="primary">
                      Waiting for Accept...
                    </Button>
                  ))}
              </Form.Item>
            </Form> */}
        </div>
      </div>
    );
  });
}
const customDot: StepsProps["progressDot"] = (dot, { status, index }) => {
  return status == "wait" ? (
    <img
      src="/form/0.png"
      className={[styles.dotimg, styles.dotimg0].join(" ")}
    />
  ) : status == "process" ? (
    <img
      src="/form/1.png"
      className={[styles.dotimg, styles.dotimg1].join(" ")}
    />
  ) : status == "finish" ? (
    <img
      src="/form/2.png"
      className={[styles.dotimg, styles.dotimg2].join(" ")}
    />
  ) : null;
};
