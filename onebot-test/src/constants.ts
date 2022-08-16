import { Finding, FindingSeverity, FindingType } from "forta-agent";

const DAI_L1_ADDRESS: string = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const L1_ESCROW_ADDRESS_OP: string = "0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65";
const L1_ESCROW_ADDRESS_ARB: string = "0xA10c7CE4b876998858b1a9E12b10092229539400";
const API_URL: string = "https://api.forta.network/graphql";
const ERC20_ABI: any[] = [
  "function balanceOf(address) view returns (uint)",
  "function totalSupply() view returns (uint)",
];

const DAI_L2_ADDRESS = "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1";

const CURR_BOT_ID = "0x9f692c9372a1bbef92992ef8dbdb4d9015362e6342ae20b3831ece1fca89ea67";

function QUERY_API(botId: string, chainId: string, endTimestamp: string) {
  let ret: string =
    `query recentAlerts {
    alerts(
      input: {
        first: 1
        blockSortDirection: desc,
        blockTimestampRange: {
          startTimestamp: 1
          endTimestamp: ` +
    endTimestamp +
    `},
        bots: [
          "`;
  ret = ret + botId;
  ret =
    ret +
    `"
    ]
  chainId: `;
  ret = ret + chainId;
  ret =
    ret +
    `}
  ) {
    pageInfo {
      hasNextPage
    }
    alerts {
      createdAt
      name
      protocol
      metadata
    }
  }
}
`;

  return ret;
}

function getFindingL1(escrowBal: string, l2Supply: string, chainName: string) {
  return Finding.fromObject({
    name: "dai-bridge-bot",
    description: "DAI balance of L1 escrow for " + chainName + " DAI bridge less than DAI supply on L2",
    alertId: "DAI_BALANCE-1",
    severity: FindingSeverity.High,
    type: FindingType.Exploit,
    protocol: "MakerDAO (mainnet)",
    metadata: {
      escrowBal: escrowBal.toString(),
      L2_chainName: chainName,
      l2_totalSupply: l2Supply.toString(),
    },
  });
}

const HEADERS: {} = {
  "content-type": "application/json",
};

export {
  DAI_L1_ADDRESS,
  ERC20_ABI,
  L1_ESCROW_ADDRESS_ARB,
  L1_ESCROW_ADDRESS_OP,
  HEADERS,
  API_URL,
  DAI_L2_ADDRESS,
  QUERY_API,
  CURR_BOT_ID,
  getFindingL1,
};
