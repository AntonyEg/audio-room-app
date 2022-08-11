let server = null;
if (window.location.protocol === 'http:') {
	server = "http://172.25.80.13:8088/janus";
} else {
	server = "http://172.25.80.13:8088/janus";
}

let iceServers = null;
let remoteStream = null;
let spinner = null;

const acodec = (getQueryStringValue("acodec") !== "" ? getQueryStringValue("acodec") : null);
const opaqueId = "audiobridgetest-" + Janus.randomString(12);
let stereo = false;
if(getQueryStringValue("stereo") !== "")
	stereo = (getQueryStringValue("stereo") === "true");

let myroom = null;
let mixertest = null;
let myusername = null;
let myid = null;
let webrtcUp = false;
let audioenabled = false;
let janus = null;