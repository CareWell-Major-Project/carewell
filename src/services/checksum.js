// import RNSimpleCrypto from 'react-native-simple-crypto';

import {JSHash, JSHmac, CONSTANTS} from 'react-native-hash';
import CryptoJS from 'react-native-crypto-js';
import merchantInfo from './config';

export async function getChecksumString(data) {
  let checksumstring = '';
  let checksumsequence = [
    'amount',
    'bankid',
    'buyerAddress',
    'buyerCity',
    'buyerCountry',
    'buyerEmail',
    'buyerFirstName',
    'buyerLastName',
    'buyerPhoneNumber',
    'buyerPincode',
    'buyerState',
    'currency',
    'debitorcredit',
    'merchantIdentifier',
    'merchantIpAddress',
    'mode',
    'orderId',
    'product1Description',
    'product2Description',
    'product3Description',
    'product4Description',
    'productDescription',
    'productInfo',
    'purpose',
    'returnUrl',
    'shipToAddress',
    'shipToCity',
    'shipToCountry',
    'shipToFirstname',
    'shipToLastname',
    'shipToPhoneNumber',
    'shipToPincode',
    'shipToState',
    'showMobile',
    'txnDate',
    'txnType',
    'zpPayOption',
  ];
  for (var seq in checksumsequence) {
    for (var key in data) {
      if (key.toString() === checksumsequence[seq]) {
        if (data[key].toString() !== '') {
          checksumstring += key + '=' + data[key].toString() + '&';
        }
      }
    }
  }
  //   console.log('checksum string:' + checksumstring);
  return checksumstring;
}

export async function getResponseChecksumString(data) {
  var checksumstring = '';
  var checksumsequence = [
    'amount',
    'bank',
    'bankid',
    'cardId',
    'cardScheme',
    'cardToken',
    'cardhashid',
    'doRedirect',
    'orderId',
    'paymentMethod',
    'paymentMode',
    'responseCode',
    'responseDescription',
    'productDescription',
    'product1Description',
    'product2Description',
    'product3Description',
    'product4Description',
    'pgTransId',
    'pgTransTime',
  ];

  for (var seq in checksumsequence) {
    for (var key in data) {
      if (key.toString() === checksumsequence[seq]) {
        checksumstring += key + '=' + data[key].toString() + '&';
      }
    }
  }
  return checksumstring;
}

export async function calculateChecksum(checksumstring) {
  // let hmac_encoded_str;
  // await JSHmac(
  //   checksumstring,
  //   merchantInfo.secretKey,
  //   CONSTANTS.HmacAlgorithms.HmacSHA256,
  // )
  //   .then(hash => {
  //     hmac_encoded_str = hash;
  //   })
  //   .catch(e => console.log(e));
  // return CryptoJS.enc.Base64.stringify(
  //   CryptoJS.enc.Utf8.parse(hmac_encoded_str),
  // );

  // return RNSimpleCrypto.HMAC.hmac256(checksumstring, merchantInfo.secretKey);
  return JSHmac(
    checksumstring,
    merchantInfo.secretKey,
    CONSTANTS.HmacAlgorithms.HmacSHA256,
  );
}
