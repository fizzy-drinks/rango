import axios from 'axios';
import getConfig from 'next/config';
import { stringify } from 'querystring';

type IpgeoResponse = {
  ip: string;
  continent_code: string;
  continent_name: string;
  country_code2: string;
  country_code3: string;
  country_name: string;
  country_capital: string;
  state_prov: string;
  district: string;
  city: string;
  zipcode: string;
  latitude: string;
  longitude: string;
  is_eu: false;
  calling_code: string;
  country_tld: string;
  languages: string;
  country_flag: string;
  geoname_id: string;
  isp: string;
  connection_type: string;
  organization: string;
  currency: {
    code: string;
    name: string;
    symbol: string;
  };
  time_zone: {
    name: string;
    offset: number;
    current_time: string;
    current_time_unix: number;
    is_dst: boolean;
    dst_savings: number;
  };
};

const ipgeo = async (ip: string): Promise<IpgeoResponse> => {
  const { serverRuntimeConfig } = getConfig();
  const { data } = await axios.get<IpgeoResponse>(
    'https://api.ipgeolocation.io/ipgeo?' +
      stringify({
        apiKey: serverRuntimeConfig.ipgeoKey,
        ip,
      })
  );
  return data;
};

export default ipgeo;
