import CryptoJS from 'CryptoJS';
//解密方法
function Decrypt(word,key) {
	key = CryptoJS.enc.Utf8.parse(key);
	var data = CryptoJS.AES.decrypt(word, key, {iv: key, padding: CryptoJS.pad.Pkcs7}).toString(CryptoJS.enc.Utf8);
	return data;
}
module.exports.Decrypt = Decrypt;