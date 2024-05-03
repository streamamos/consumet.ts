"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const utils_1 = require("../utils");
class VidCloud extends models_1.VideoExtractor {
    constructor() {
        super(...arguments);
        this.serverName = 'VidCloud';
        this.sources = [];
        this.host = 'https://dokicloud.one';
        this.host2 = 'https://rabbitstream.net';
        this.extract = async (videoUrl, isAlternative = false) => {
            var _a;
            const result = {
                sources: [],
                subtitles: [],
            };
            try {
                const id = (_a = videoUrl.href.split('/').pop()) === null || _a === void 0 ? void 0 : _a.split('?')[0];
                const options = {
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        Referer: videoUrl.href,
                        'User-Agent': utils_1.USER_AGENT,
                    },
                };
                let res = undefined;
                let sources = undefined;
                /*
               res = await this.client.get(
                  `${isAlternative ? this.host2 : this.host}/ajax/embed-4/getSources?id=${id}`,
                  options
                );
           
                if (!isJson(res.data.sources) && !res.data.sources[0].file.endsWith("playlist.m3u8")) {
                  let keys = await (await this.client.get('https://keys4.fun')).data["rabbitstream"]["keys"];
                  let keyString = btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(keys))));
                  console.log(CryptoJS.AES.decrypt(res.data.sources, keyString).toString(CryptoJS.enc.Utf8));
                  sources = JSON.parse(CryptoJS.AES.decrypt(res.data.sources, keyString).toString(CryptoJS.enc.Utf8))
                } else {
                  sources = res.data.sources;
                }
           
                this.sources = sources.map((s: any) => ({
                  url: s.file,
                  isM3U8: s.file.includes('.m3u8'),
                }));
           
                result.sources.push(...this.sources);
           
                result.sources = [];
                this.sources = [];
           
                for (const source of sources) {
                  const { data } = await this.client.get(source.file, options);
                  const urls = data.split('\n').filter((line: string) => line.includes('.m3u8')) as string[];
                  const qualities = data.split('\n').filter((line: string) => line.includes('RESOLUTION=')) as string[];
           
                  const TdArray = qualities.map((s, i) => {
                    const f1 = s.split('x')[1];
                    const f2 = urls[i];
           
                    return [f1, f2];
                  });
           
                  for (const [f1, f2] of TdArray) {
                    this.sources.push({
                      url: f2,
                      quality: f1,
                      isM3U8: f2.includes('.m3u8'),
                    });
                  }
                  result.sources.push(...this.sources);
                }
           
                result.sources.push({
                  url: sources[0].file,
                  isM3U8: sources[0].file.includes('.m3u8'),
                  quality: 'auto',
                });
           
                result.subtitles = res.data.tracks.map((s: any) => ({
                  url: s.file,
                  lang: s.label ? s.label : 'Default (maybe)',
                }));
           
                return result; */
                res = await this.client.post("https://rabbitthunder-ruddy.vercel.app/api/upcloud", { id: id });
                let { source, subtitle } = res.data;
                if (source.startsWith("https://b-g-")) {
                    const parts = source.split('/');
                    if (parts.length >= 4) {
                        source = `https://ek.megacdn.co:2228/${parts.slice(3).join('/')}`;
                    }
                }
                const result = {
                    sources: [{
                            url: source,
                            isM3U8: source.includes('.m3u8'),
                            quality: 'auto',
                        }],
                    subtitles: subtitle[0].map((s) => ({
                        url: s.file,
                        lang: s.label ? s.label : 'Default (maybe)',
                    })),
                };
                // Fetch qualities for the source
                const { data } = await this.client.get(source, options);
                const urls = data.split('\n').filter((line) => line.includes('.m3u8'));
                const qualities = data.split('\n').filter((line) => line.includes('RESOLUTION='));
                const TdArray = qualities.map((s, i) => {
                    const f1 = s.split('x')[1];
                    const f2 = urls[i];
                    return [f1, f2];
                });
                for (const [f1, f2] of TdArray) {
                    result.sources.push({
                        url: f2,
                        quality: f1,
                        isM3U8: f2.includes('.m3u8'),
                    });
                }
                const autoIndex = result.sources.findIndex(source => source.quality === 'auto');
                if (autoIndex !== -1) {
                    const autoSource = result.sources.splice(autoIndex, 1)[0];
                    result.sources.push(autoSource);
                }
                return result;
            }
            catch (err) {
                throw err;
            }
        };
    }
}
exports.default = VidCloud;
//# sourceMappingURL=vidcloud.js.map
