import { RaceData } from "../types";

export const DEFAULT_DATA: RaceData = {
  title: "Most Popular Social Media Platforms (2012-2022)",
  subtitle: "Active Users (in Millions)",
  source: "DataReportal & Statista",
  entities: [
    { id: "fb", label: "Facebook", color: "#1877F2", image: "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" },
    { id: "yt", label: "YouTube", color: "#FF0000", image: "https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg" },
    { id: "wa", label: "WhatsApp", color: "#25D366", image: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" },
    { id: "ig", label: "Instagram", color: "#E4405F", image: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" },
    { id: "tt", label: "TikTok", color: "#000000", image: "https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg" },
    { id: "wx", label: "WeChat", color: "#7BB32E", image: "https://upload.wikimedia.org/wikipedia/en/c/c5/WeChat_logo.png" },
  ],
  timeline: [
    { date: "2012", values: { fb: 900, yt: 700, wa: 150, ig: 50, tt: 0, wx: 100 } },
    { date: "2013", values: { fb: 1100, yt: 900, wa: 300, ig: 120, tt: 0, wx: 250 } },
    { date: "2014", values: { fb: 1300, yt: 1100, wa: 500, ig: 250, tt: 0, wx: 400 } },
    { date: "2015", values: { fb: 1500, yt: 1300, wa: 800, ig: 400, tt: 0, wx: 600 } },
    { date: "2016", values: { fb: 1700, yt: 1400, wa: 1000, ig: 550, tt: 50, wx: 800 } },
    { date: "2017", values: { fb: 1900, yt: 1500, wa: 1200, ig: 750, tt: 150, wx: 900 } },
    { date: "2018", values: { fb: 2100, yt: 1700, wa: 1400, ig: 900, tt: 400, wx: 1000 } },
    { date: "2019", values: { fb: 2300, yt: 1900, wa: 1600, ig: 1000, tt: 600, wx: 1100 } },
    { date: "2020", values: { fb: 2500, yt: 2100, wa: 1800, ig: 1200, tt: 800, wx: 1150 } },
    { date: "2021", values: { fb: 2700, yt: 2300, wa: 2000, ig: 1300, tt: 1000, wx: 1200 } },
    { date: "2022", values: { fb: 2910, yt: 2562, wa: 2000, ig: 1478, tt: 1000, wx: 1263 } },
  ]
};
