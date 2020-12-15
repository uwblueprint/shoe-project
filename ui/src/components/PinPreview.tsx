import Button from "@material-ui/core/Button";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import * as React from "react";
import styled from "styled-components";

import WWFlag from "../assets/flags/WW.svg";
import IndiaFlag from "../assets/flags/India.svg";
import TempShoe from "../assets/images/temp.png";

import { colors } from "../styles/colors";
import {
  CardDescriptionText,
  CardDetailText,
  CardTagText,
  CardTitleText,
} from "../styles/typography";

const StyledButton = styled(Button)`
  && {
    color: ${colors.primaryDark2};
    background-color: ${colors.primaryLight4};
    height: 48px;
    width: 100%;

    &:hover {
      background-color: ${colors.primaryLight3};
    }
  }
`;

const StyledMedia = styled(CardMedia)`
  border-radius: 10px 10px 0px 0px;
  height: 211px;
`;

const StyledCardContent = styled(CardContent)`
  border-radius: 10px;
  overflow: hidden;
`;

interface PinPreviewProps {
  title: string;
  description: string;
  author: string;
  date: string;
  country: string;
  shoeImage: string;
  onClick: () => void;
}

// async function importFlag(importStr:string) {
//   const flag = await import(importStr);
//   return flag as string;
// }

const flags = {
  Afghanistan: import("../assets/flags/Afghanistan.svg"),
  Albania: import("../assets/flags/Albania.svg"),
  Algeria: import("../assets/flags/Algeria.svg"),
  Andorra: import("../assets/flags/Andorra.svg"),
  Angola: import("../assets/flags/Angola.svg"),
  Anguilla: import("../assets/flags/Anguilla.svg"),
  "Antigua and Barbuda": import("../assets/flags/Antigua and Barbuda.svg"),
  Argentina: import("../assets/flags/Argentina.svg"),
  Armenia: import("../assets/flags/Armenia.svg"),
  Aruba: import("../assets/flags/Aruba.svg"),
  Australia: import("../assets/flags/Australia.svg"),
  Austria: import("../assets/flags/Austria.svg"),
  Azerbaijan: import("../assets/flags/Azerbaijan.svg"),
  "Åland Islands": import("../assets/flags/Åland Islands.svg"),
  Bahamas: import("../assets/flags/Bahamas.svg"),
  Bahrain: import("../assets/flags/Bahrain.svg"),
  Bangladesh: import("../assets/flags/Bangladesh.svg"),
  Barbados: import("../assets/flags/Barbados.svg"),
  Belarus: import("../assets/flags/Belarus.svg"),
  Belgium: import("../assets/flags/Belgium.svg"),
  Belize: import("../assets/flags/Belize.svg"),
  Benin: import("../assets/flags/Benin.svg"),
  Bermuda: import("../assets/flags/Bermuda.svg"),
  Bhutan: import("../assets/flags/Bhutan.svg"),
  Bolivia: import("../assets/flags/Bolivia.svg"),
  "Bosnia and Herzegovina": import(
    "../assets/flags/Bosnia and Herzegovina.svg"
  ),
  Botswana: import("../assets/flags/Botswana.svg"),
  Brazil: import("../assets/flags/Brazil.svg"),
  "British Virgin Islands": import(
    "../assets/flags/British Virgin Islands.svg"
  ),
  Brunei: import("../assets/flags/Brunei.svg"),
  Bulgaria: import("../assets/flags/Bulgaria.svg"),
  "Burkina Faso": import("../assets/flags/Burkina Faso.svg"),
  Burundi: import("../assets/flags/Burundi.svg"),
  CAF: import("../assets/flags/CAF.svg"),
  CAS: import("../assets/flags/CAS.svg"),
  CEU: import("../assets/flags/CEU.svg"),
  CNA: import("../assets/flags/CNA.svg"),
  COC: import("../assets/flags/COC.svg"),
  CSA: import("../assets/flags/CSA.svg"),
  "Cabo Verde": import("../assets/flags/Cabo Verde.svg"),
  Cambodia: import("../assets/flags/Cambodia.svg"),
  Cameroon: import("../assets/flags/Cameroon.svg"),
  Canada: import("../assets/flags/Canada.svg"),
  "Cayman Islands": import("../assets/flags/Cayman Islands.svg"),
  "Central African Republic": import(
    "../assets/flags/Central African Republic.svg"
  ),
  Chile: import("../assets/flags/Chile.svg"),
  China: import("../assets/flags/China.svg"),
  Colombia: import("../assets/flags/Colombia.svg"),
  Comoros: import("../assets/flags/Comoros.svg"),
  "Congo, Democratic Republic of the": import(
    "../assets/flags/Congo, Democratic Republic of the.svg"
  ),
  "Congo, Republic of the": import(
    "../assets/flags/Congo, Republic of the.svg"
  ),
  "Cote d'Ivoire": import("../assets/flags/Cote d'Ivoire.svg"),
  "Croatia-1": import("../assets/flags/Croatia-1.svg"),
  Croatia: import("../assets/flags/Croatia.svg"),
  Cuba: import("../assets/flags/Cuba.svg"),
  Cyprus: import("../assets/flags/Cyprus.svg"),
  Czechia: import("../assets/flags/Czechia.svg"),
  Denmark: import("../assets/flags/Denmark.svg"),
  Djibouti: import("../assets/flags/Djibouti.svg"),
  Dominica: import("../assets/flags/Dominica.svg"),
  "Dominican Republic": import("../assets/flags/Dominican Republic.svg"),
  Ecuador: import("../assets/flags/Ecuador.svg"),
  Egypt: import("../assets/flags/Egypt.svg"),
  "El Salvador": import("../assets/flags/El Salvador.svg"),
  "Equatorial Guinea": import("../assets/flags/Equatorial Guinea.svg"),
  Eritrea: import("../assets/flags/Eritrea.svg"),
  Estonia: import("../assets/flags/Estonia.svg"),
  Ethiopia: import("../assets/flags/Ethiopia.svg"),
  "European Union": import("../assets/flags/European Union.svg"),
  "Falkland Islands": import("../assets/flags/Falkland Islands.svg"),
  "Federated States of Micronesia": import(
    "../assets/flags/Federated States of Micronesia.svg"
  ),
  Fiji: import("../assets/flags/Fiji.svg"),
  Finland: import("../assets/flags/Finland.svg"),
  France: import("../assets/flags/France.svg"),
  "French Polynesia": import("../assets/flags/French Polynesia.svg"),
  Gabon: import("../assets/flags/Gabon.svg"),
  Gambia: import("../assets/flags/Gambia.svg"),
  Georgia: import("../assets/flags/Georgia.svg"),
  Germany: import("../assets/flags/Germany.svg"),
  Ghana: import("../assets/flags/Ghana.svg"),
  Gibraltar: import("../assets/flags/Gibraltar.svg"),
  Greece: import("../assets/flags/Greece.svg"),
  Grenada: import("../assets/flags/Grenada.svg"),
  Guatemala: import("../assets/flags/Guatemala.svg"),
  Guernsey: import("../assets/flags/Guernsey.svg"),
  "Guinea-Bissau": import("../assets/flags/Guinea-Bissau.svg"),
  Guinea: import("../assets/flags/Guinea.svg"),
  Guyana: import("../assets/flags/Guyana.svg"),
  Haiti: import("../assets/flags/Haiti.svg"),
  Honduras: import("../assets/flags/Honduras.svg"),
  "Hong Kong": import("../assets/flags/Hong Kong.svg"),
  Hungary: import("../assets/flags/Hungary.svg"),
  Iceland: import("../assets/flags/Iceland.svg"),
  India: import("../assets/flags/India.svg"),
  Indonesia: import("../assets/flags/Indonesia.svg"),
  Iran: import("../assets/flags/Iran.svg"),
  Iraq: import("../assets/flags/Iraq.svg"),
  Ireland: import("../assets/flags/Ireland.svg"),
  "Isle of Man": import("../assets/flags/Isle of Man.svg"),
  Israel: import("../assets/flags/Israel.svg"),
  Italy: import("../assets/flags/Italy.svg"),
  Jamaica: import("../assets/flags/Jamaica.svg"),
  Japan: import("../assets/flags/Japan.svg"),
  Jersey: import("../assets/flags/Jersey.svg"),
  Jordan: import("../assets/flags/Jordan.svg"),
  Kazakhstan: import("../assets/flags/Kazakhstan.svg"),
  Kenya: import("../assets/flags/Kenya.svg"),
  Kuwait: import("../assets/flags/Kuwait.svg"),
  Kyrgyzstan: import("../assets/flags/Kyrgyzstan.svg"),
  Laos: import("../assets/flags/Laos.svg"),
  Latvia: import("../assets/flags/Latvia.svg"),
  Lebanon: import("../assets/flags/Lebanon.svg"),
  Lesotho: import("../assets/flags/Lesotho.svg"),
  Liberia: import("../assets/flags/Liberia.svg"),
  Libya: import("../assets/flags/Libya.svg"),
  Liechtenstein: import("../assets/flags/Liechtenstein.svg"),
  Lithuania: import("../assets/flags/Lithuania.svg"),
  Luxembourg: import("../assets/flags/Luxembourg.svg"),
  Macao: import("../assets/flags/Macao.svg"),
  Macedonia: import("../assets/flags/Macedonia.svg"),
  Madagascar: import("../assets/flags/Madagascar.svg"),
  Malawi: import("../assets/flags/Malawi.svg"),
  Malaysia: import("../assets/flags/Malaysia.svg"),
  Maldives: import("../assets/flags/Maldives.svg"),
  Mali: import("../assets/flags/Mali.svg"),
  Malta: import("../assets/flags/Malta.svg"),
  Mauritania: import("../assets/flags/Mauritania.svg"),
  Mauritius: import("../assets/flags/Mauritius.svg"),
  Mexico: import("../assets/flags/Mexico.svg"),
  Moldova: import("../assets/flags/Moldova.svg"),
  Monaco: import("../assets/flags/Monaco.svg"),
  Mongolia: import("../assets/flags/Mongolia.svg"),
  Montenegro: import("../assets/flags/Montenegro.svg"),
  Montserrat: import("../assets/flags/Montserrat.svg"),
  Morocco: import("../assets/flags/Morocco.svg"),
  Mozambique: import("../assets/flags/Mozambique.svg"),
  "Myanmar (Burma)": import("../assets/flags/Myanmar (Burma).svg"),
  Namibia: import("../assets/flags/Namibia.svg"),
  Nepal: import("../assets/flags/Nepal.svg"),
  "Netherlands Antilles": import("../assets/flags/Netherlands Antilles.svg"),
  Netherlands: import("../assets/flags/Netherlands.svg"),
  "New Zealand": import("../assets/flags/New Zealand.svg"),
  Nicaragua: import("../assets/flags/Nicaragua.svg"),
  Niger: import("../assets/flags/Niger.svg"),
  Nigeria: import("../assets/flags/Nigeria.svg"),
  "North Korea": import("../assets/flags/North Korea.svg"),
  Norway: import("../assets/flags/Norway.svg"),
  Oman: import("../assets/flags/Oman.svg"),
  Pakistan: import("../assets/flags/Pakistan.svg"),
  Palau: import("../assets/flags/Palau.svg"),
  Panama: import("../assets/flags/Panama.svg"),
  "Papa New Guinea": import("../assets/flags/Papa New Guinea.svg"),
  Paraguay: import("../assets/flags/Paraguay.svg"),
  Peru: import("../assets/flags/Peru.svg"),
  Philippines: import("../assets/flags/Philippines.svg"),
  Poland: import("../assets/flags/Poland.svg"),
  Portugal: import("../assets/flags/Portugal.svg"),
  "Puerto Rico": import("../assets/flags/Puerto Rico.svg"),
  Qatar: import("../assets/flags/Qatar.svg"),
  "Republic of Chad": import("../assets/flags/Republic of Chad.svg"),
  Romania: import("../assets/flags/Romania.svg"),
  Russia: import("../assets/flags/Russia.svg"),
  Rwanda: import("../assets/flags/Rwanda.svg"),
  "Saint Helena, Ascension and Tristan da Cunha": import(
    "../assets/flags/Saint Helena, Ascension and Tristan da Cunha.svg"
),
  "Saint Kitts and Nevis": import("../assets/flags/Saint Kitts and Nevis.svg"),
  "Saint Lucia": import("../assets/flags/Saint Lucia.svg"),
  "Saint Vincent and the Grenadines": import(
    "../assets/flags/Saint Vincent and the Grenadines.svg"
  ),
  Samoa: import("../assets/flags/Samoa.svg"),
  "San Marino": import("../assets/flags/San Marino.svg"),
  "Sao Tome and Principe": import("../assets/flags/Sao Tome and Principe.svg"),
  "Saudi Arabia": import("../assets/flags/Saudi Arabia.svg"),
  Senegal: import("../assets/flags/Senegal.svg"),
  Serbia: import("../assets/flags/Serbia.svg"),
  Seychelles: import("../assets/flags/Seychelles.svg"),
  "Sierra Leone": import("../assets/flags/Sierra Leone.svg"),
  Singapore: import("../assets/flags/Singapore.svg"),
  Slovakia: import("../assets/flags/Slovakia.svg"),
  Slovenia: import("../assets/flags/Slovenia.svg"),
  "Soloman Islands": import("../assets/flags/Soloman Islands.svg"),
  Somalia: import("../assets/flags/Somalia.svg"),
  "South Africa": import("../assets/flags/South Africa.svg"),
  "South Korea": import("../assets/flags/South Korea.svg"),
  Spain: import("../assets/flags/Spain.svg"),
  "Sri Lanka": import("../assets/flags/Sri Lanka.svg"),
  Sudan: import("../assets/flags/Sudan.svg"),
  Suriname: import("../assets/flags/Suriname.svg"),
  Swaziland: import("../assets/flags/Swaziland.svg"),
  Sweden: import("../assets/flags/Sweden.svg"),
  Switzerland: import("../assets/flags/Switzerland.svg"),
  Syria: import("../assets/flags/Syria.svg"),
  Taiwan: import("../assets/flags/Taiwan.svg"),
  Tajikistan: import("../assets/flags/Tajikistan.svg"),
  Tanzania: import("../assets/flags/Tanzania.svg"),
  Thailand: import("../assets/flags/Thailand.svg"),
  "Timor-Leste": import("../assets/flags/Timor-Leste.svg"),
  Togo: import("../assets/flags/Togo.svg"),
  Tonga: import("../assets/flags/Tonga.svg"),
  "Trinidad and Tobago": import("../assets/flags/Trinidad and Tobago.svg"),
  Tunisia: import("../assets/flags/Tunisia.svg"),
  Turkey: import("../assets/flags/Turkey.svg"),
  Turkmenistan: import("../assets/flags/Turkmenistan.svg"),
  "Turks and Caicos Islands": import(
    "../assets/flags/Turks and Caicos Islands.svg"
  ),
  Uganda: import("../assets/flags/Uganda.svg"),
  Ukraine: import("../assets/flags/Ukraine.svg"),
  "United Arab Emirates": import("../assets/flags/United Arab Emirates.svg"),
  "United Kingdom": import("../assets/flags/United Kingdom.svg"),
  "United States of America": import(
    "../assets/flags/United States of America.svg"
  ),
  Uruguay: import("../assets/flags/Uruguay.svg"),
  Uzbekistan: import("../assets/flags/Uzbekistan.svg"),
  Vanuatu: import("../assets/flags/Vanuatu.svg"),
  Venezuela: import("../assets/flags/Venezuela.svg"),
  Vietnam: import("../assets/flags/Vietnam.svg"),
  WW: import("../assets/flags/WW.svg"),
  Yemen: import("../assets/flags/Yemen.svg"),
  Zambia: import("../assets/flags/Zambia.svg"),
  Zimbabwe: import("../assets/flags/Zimbabwe.svg"),
};

async function importFlag(importStr:string) {
  const flag = await flags[importStr];
  return flag as string;
}


export function PinPreview({
  title,
  description,
  author,
  date,
  country,
  shoeImage,
  onClick,
}: PinPreviewProps): JSX.Element {

  const importStr = `../assets/flags/${country}.svg`

  // var flag = importFlag(importStr);

  const flag = React.useRef("")
  React.useEffect(() => {
    importFlag(importStr).then(f=> {
      flag.current = f;
      console.log(f)
    })
    .catch(error)
  })


  // if(flag && flag.current !== ""){
  //   console.log("HERE");
  //   console.log(flag.current);
  // }

  return (
    <>
      <StyledMedia image={shoeImage} title="Temporary Image" />
      <StyledCardContent>
        {flag && flag.current !== "" && (
          <img alt="flag" src={flag.current} />
        )}
        {/* <img alt="flag" src={WWFlag} /> */}
        <CardTagText>{country}</CardTagText>
        <CardTitleText>{title}</CardTitleText>
        <CardDescriptionText>{description}</CardDescriptionText>
        <StyledButton
          variant="contained"
          color="primary"
          disableElevation
          onClick={onClick}
        >
          Read Full Story
        </StyledButton>
        <CardDetailText>
          {author} • {date}
        </CardDetailText>
      </StyledCardContent>
    </>
  );
}
