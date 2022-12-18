(this["webpackJsonphc-2022-front-end-prototype"]=this["webpackJsonphc-2022-front-end-prototype"]||[]).push([[0],{107:function(e,t,a){},108:function(e,t,a){},126:function(e,t,a){},127:function(e,t,a){},141:function(e,t,a){"use strict";a.r(t);var n=a(2),o=a.n(n),i=a(51),s=a.n(i),r=(a(59),a.p+"static/media/logo.3fa6c0cc.svg"),c=(a(60),a(61),a(62),a(0));function d(e){var t=e.logo;return Object(c.jsxs)("div",{className:"Logo",children:[Object(c.jsx)("img",{src:t,className:"HC-logo",alt:"logo"}),Object(c.jsx)("h1",{children:"Hack Cambridge Spyder"})]})}var l=a(5);a(64),a(65);function h(e){var t=e.name,a=e.href;return Object(c.jsx)("a",{href:a,className:"NavElement",children:t})}function u(e){var t=e.elements;return Object(c.jsx)("div",{className:"Nav",children:t.map((function(e){return Object(c.jsx)(h,Object(l.a)({},e),e.name)}))})}function b(e){var t=e.logoPath,a=e.navElements;return Object(c.jsxs)("header",{children:[Object(c.jsx)(d,{logo:t}),Object(c.jsx)(u,{elements:a})]})}a(66);var p=a(9),m=a.n(p);function j(e){return Object(c.jsx)("div",{className:"AboutUs",id:"about-us",children:Object(c.jsxs)("div",{className:"about-us-col about-us-col-1",children:[Object(c.jsxs)(m.a,{left:!0,children:[Object(c.jsx)("h1",{children:"Join us"}),Object(c.jsx)("h2",{children:"to make a difference"})]}),Object(c.jsx)(m.a,{bottom:!0,children:Object(c.jsx)("div",{className:"about-us-with-dec",children:Object(c.jsx)("div",{className:"about-us-with-dec-col-1",children:Object(c.jsxs)("p",{children:["Greetings from Hack Cambridge! We know that you are as excited as we are about the upcoming event.",Object(c.jsx)("br",{}),"The largest student-run hackathon in Cambridge is back for its 8th season in March 2023.",Object(c.jsx)("br",{}),"Hack Cambridge Spyder is incredible opportunity for you to explore all possibilities in a sprint-like event.",Object(c.jsx)("br",{}),"Come with your team to hack together for 24 hours, talk to recruiters from our sponsors and enjoy the workshops!",Object(c.jsx)("br",{}),"We hope to bring keen, ambitious and talented students together and create original solutions for social good.",Object(c.jsx)("br",{}),"Together with your energy, creativity, hacker spirit, we hope to empower a better, more sustainable future.",Object(c.jsx)("br",{}),"We look forward to meeting you at Hack Cambridge Spyder!"]})})})})]})})}var f=a(22),g=(a(78),a(79),a(52));function v(e){var t=e.question,a=e.answer,n=e.folded,o=e.onButtonClick;return Object(c.jsx)(p.Fade,{right:!0,children:Object(c.jsxs)("div",{className:"FAQTextBox",children:[Object(c.jsx)("button",{className:"FAQ-button",onClick:o,children:Object(c.jsx)("p",{children:t})}),Object(c.jsx)(g.Collapse,{isOpened:!n,children:Object(c.jsx)("div",{className:"text",children:a.split("\n").map((function(e){return Object(c.jsx)("div",{children:e})}))})})]})})}function O(e){var t=e.qs,a=Object(n.useState)(-1),o=Object(f.a)(a,2),i=o[0],s=o[1];return Object(c.jsx)("div",{className:"FAQ",id:"faq",children:Object(c.jsxs)("div",{className:"faq-col-3",children:[Object(c.jsx)(m.a,{center:!0,children:Object(c.jsx)("h1",{children:"FAQs"})}),t.map((function(e,t){return t===i?Object(c.jsx)("div",{className:t%2===1?"faq-col-3-1":"faq-col-3-2",children:Object(c.jsx)(v,Object(l.a)(Object(l.a)({},e),{},{folded:!1,onButtonClick:function(e){e.preventDefault(),s(-1)}}),e.question)},e.question):Object(c.jsx)("div",{className:t%2===1?"faq-col-3-1":"faq-col-3-2",children:Object(c.jsx)(v,Object(l.a)(Object(l.a)({},e),{},{folded:!0,onButtonClick:function(e){e.preventDefault(),s(t)}}),e.question)},e.question)}))]})})}a(81),a(82);var x=function(e){var t=+e-+new Date,a={days:"00",hours:"00",minutes:"00",seconds:"00"};if(t>0){var n={days:Math.floor(t/864e5),hours:Math.floor(t/36e5%24),minutes:Math.floor(t/1e3/60%60),seconds:Math.floor(t/1e3%60)};a={days:n.days<10?"0"+n.days:""+n.days,hours:n.hours<10?"0"+n.hours:""+n.hours,minutes:n.minutes<10?"0"+n.minutes:""+n.minutes,seconds:n.seconds<10?"0"+n.seconds:""+n.seconds}}return a};function w(e){var t=e.targetDate,a=e.until,o=Object(n.useState)(x(t)),i=Object(f.a)(o,2),s=i[0],r=i[1];return Object(n.useEffect)((function(){var e=setTimeout((function(){r(x(t))}),1e3);return function(){clearTimeout(e)}}),[t,s]),Object(c.jsxs)("div",{className:"Timer",children:[Object(c.jsx)("h1",{children:"".concat(s.days,":").concat(s.hours,":").concat(s.minutes,":").concat(s.seconds)}),Object(c.jsxs)("h3",{children:["Until ",a]})]})}var y=new Date("03/10/2023");function k(e){e.name;var t=e.href,a=e.applicationsOpen;return Object(c.jsx)("div",{className:"Landing",children:Object(c.jsxs)("div",{className:"landing-main",children:[Object(c.jsx)(m.a,{left:!0,children:Object(c.jsxs)("div",{className:"landing-col1",children:[Object(c.jsx)("h1",{className:"landing-hc-title landing-hc-title-small",children:"Hack Cambridge"}),Object(c.jsx)("h1",{className:"landing-hc-title landing-hc-title-big",children:"Spyder"}),Object(c.jsx)("h1",{className:"landing-date",children:"11-12 Mar 2023"}),Object(c.jsxs)("p",{children:["Cambridge's biggest student-run hackathon is back! ",Object(c.jsx)("br",{}),"Our eighth hackathon will run both virtually and in-person. ",Object(c.jsx)("br",{}),"We're excited to present Hack Cambridge Spyder 2023."]})]})}),Object(c.jsxs)("div",{className:"landing-col2",children:[Object(c.jsx)(w,{targetDate:y,until:"Applications Open"}),a&&Object(c.jsx)("a",{href:t,className:"apply-button",children:"Apply today!"}),!a&&Object(c.jsxs)(c.Fragment,{children:[Object(c.jsx)("a",{href:"https://forms.gle/ER9FETGS1fou3XJf9",className:"apply-button apps-closed",children:"Join Mailing List"}),Object(c.jsx)("a",{href:"mailto://team@hackcambridge.com",className:"apply-button apps-closed",children:" Interested in Sponsoring Us? "})]})]})]})})}a(83);var C=a(53),N=a.n(C);a(107);function H(e){var t=e.photo,a=e.caption;return Object(c.jsx)("div",{className:"PastPhotoItem",style:{backgroundImage:'url("'.concat(t,'")')},children:Object(c.jsx)("div",{className:"past-photo-item__hover",children:a})})}var q={0:{items:1},568:{items:2},1024:{items:3}};function T(e){var t=e.items;return Object(c.jsxs)("div",{className:"PastPhotos",children:[Object(c.jsxs)(m.a,{left:!0,children:[Object(c.jsx)("h1",{children:"Looking back"}),Object(c.jsx)("h2",{children:"on our past events"})]}),Object(c.jsx)(m.a,{right:!0,children:Object(c.jsx)(N.a,{disableButtonsControls:!0,mouseTracking:!0,touchTracking:!0,items:t.map((function(e,t){return Object(c.jsx)(H,Object(l.a)({},e),t)})),responsive:q,controlsStrategy:"alternate"})})]})}a(108);var S=a.p+"static/media/hc-2016-1.87dd3f1f.jpg",D=a.p+"static/media/hc-2017-1.3a62da6c.jpg",A=a.p+"static/media/hc-2018-1.971ce084.jpg",F=a.p+"static/media/hc-2018-2.a4813531.jpg",W=a.p+"static/media/hc-2019-1.b4305e19.jpg",P=a.p+"static/media/hc-2019-2.ac2cbc16.jpg",E=a.p+"static/media/hc-2019-3.d1b33236.jpg",I=a.p+"static/media/hc-2020-1.199c05b5.jpg",L=a.p+"static/media/hc-2020-2.3d77efcc.jpg",M=a.p+"static/media/hc-2021-1.eb955096.png",B=[{question:"What is a hackathon?",answer:"A hackathon is an invention marathon. Thoughts become things. Attendees work in teams of up to 4 people to hack together a prototype to solve a problem; this could be a web app, hardware-hack, or something completely different.",folded:!0},{question:"How does the hybrid Hackathon work\uff1fCan my team be considered for prizes or chat with your sponsors?",answer:"We will invite 350 participants to join us in-person at Cambridge for the Event and 200 to join us through Discord. All workshops and engagement sessions will happen in-person while being live-streamed on Discord. Our sponsors will join Discord to interact with you if you participate online. Judging for online participants will take place through Discord too. When we invite you to the event, the email will specify whether we would be able to offer you a place offline. We would really hope to accommodate everyone offline, but your safety and health is our top one priority.",folded:!0},{question:"How is the hackathon going to take place?",answer:"This year Hack Cambridge Spyder is planned as a Hybrid Event with 350 participants offline at Cambridge and 200 participants online through Discord. The workshops and all engagement opportunities will happen offline while being live-streamed on Discord.",folded:!0},{question:"Do I need a team to apply?",answer:"Nope! You are of course welcome to apply in a pre-formed team but some of our hackers will meet their team at the start of the event.",folded:!0},{question:"How large can the teams be?",answer:"To achieve fairness in the event, no more than 4 people can be in a team.",folded:!0},{question:"I am not from the University of Cambridge. Am I allowed to attend?",answer:"Anyone who is currently a registered student or has graduated after 10th March 2022 is eligible to attend. Sadly we can't accommodate anyone under the age of 18 this year.",folded:!0},{question:"Is Hack Cambridge Spyder free to attend?",answer:"Absolutely! Participation is free for all invited hackers. We provide interesting workshops, entertaining activties, and some swag during the event.",folded:!0},{question:"What is the Code of Conduct for Hack Cambridge Spyder?",answer:"We follow the Code of Conduct from MLH: https://mlh.io/code-of-conduct.",folded:!0},{question:"What is your current covid-19 policies if I am attending the event in-person?",answer:"Your registration, RSVP, fully-vaccinated status (or exemption) AND a negative result for a Covid-19 test taken within 24 hours of the event entitles you to admittance to the in-person HackCambridge Atlas event. Rather than using COVID Pass, we require a text or email notification of your test from NHS Test and Trace as a condition of entry*.\n        Registration opens at 0900 on Saturday 11th March 2023. We require you to have taken a negative PCR or rapid lateral flow test within 24 hours of the event, preferably within 12 hours. As our event is >30 hours long, we will not accept tests taken on Thursday, even if they are within 48 hours of registration. The Government advises that \u201cto strengthen the protection testing provides you should take tests as late as possible before attending the event, ideally within 12 hours\u201d\n        Fully-vaccinated status means that you you are vaccinated with 2 doses of an approved vaccine (or one of the single-dose Janssen vaccine). By attending our in-person event you declare that you do meet the criteria outlined above. The vaccines approved in the UK can be found on the government website: https://www.gov.uk/guidance/countries-with-approved-covid-19-vaccination-programmes-and-proof-of-vaccination.\n        *If that is not your case or  if you think you are exempt from either or both of our COVID requirements, please email us (team@hackcambridge.com) and we will judge on a case-by-case basis.\n        We would require you to prepare at least two sets of lateral flow test kit (one for entering the event venue and one more as a back up in case of emergency/if you leave the venue during the event). We would require the result of LFT to be reported to NHS thus your test kits must be the NHS-approved ones. More details on this will come together with the event invitation. There have been news articles about the shortage of LFTs, thus we would encourage you to prepare the kits in advance - especially if you are arriving in Cambridge very close to the event. You can use the NHS website to find out where to get rapid lateral flow tests.\n        ",folded:!0}],J=[{photo:M,caption:"Hex Cambridge"},{photo:I,caption:"Hack Cambridge 101"},{photo:L,caption:"Hack Cambridge 101"},{photo:W,caption:"Hack Cambridge 4D"},{photo:P,caption:"Hack Cambridge 4D"},{photo:E,caption:"Hack Cambridge 4D"},{photo:A,caption:"Hack Cambridge Ternary"},{photo:F,caption:"Hack Cambridge Ternary"},{photo:D,caption:"Hack Cambridge Recurse"},{photo:S,caption:"Hack Cambridge 2016 -- Where we started"}];function _(e){return Object(c.jsxs)("div",{className:"Body",children:[Object(c.jsx)(k,{href:"/apply",applicationsOpen:false}),Object(c.jsx)(j,{}),Object(c.jsx)(T,{items:J}),Object(c.jsx)(O,{qs:B})]})}var R=a(27),U=(a(126),a(127),a.p+"static/media/facebook.4f037d96.png"),Q=a.p+"static/media/linkedin.6892b3ae.png",G=a.p+"static/media/instagram.cd1bed26.png",z=a.p+"static/media/email.bd9ac138.png";function V(e){return Object(c.jsxs)("div",{className:"Footer",children:[Object(c.jsx)("div",{className:"JoinUs",children:Object(c.jsx)("a",{href:"https://forms.gle/ER9FETGS1fou3XJf9",children:Object(c.jsx)("h1",{children:"Join our mailing list!"})})}),Object(c.jsxs)("div",{className:"SocialMedia",children:[Object(c.jsx)("a",{href:"mailto://team@hackcambridge.com",children:Object(c.jsx)("img",{src:z,alt:"email"})}),Object(c.jsx)("a",{href:"https://www.facebook.com/hackcambridge",children:Object(c.jsx)("img",{src:U,alt:"Facebook"})}),Object(c.jsx)("a",{href:"https://www.linkedin.com/company/hack-cambridge",children:Object(c.jsx)("img",{src:Q,alt:"Linkedin"})}),Object(c.jsx)("a",{href:"https://www.instagram.com/hack_cambridge/",children:Object(c.jsx)("img",{src:G,alt:"Instagram"})})]})]})}var Y=function(){var e=Object(R.useController)().parallaxController;return Object(n.useLayoutEffect)((function(){var t=function(){return e.update()};return window.addEventListener("load",t),function(){window.removeEventListener("load",t)}}),[e]),null};function X(e){return Object(c.jsx)("div",{className:"Home",children:Object(c.jsxs)(R.ParallaxProvider,{children:[Object(c.jsx)(Y,{}),Object(c.jsx)(_,{}),Object(c.jsx)(V,{})]})})}var K=(new(a(54).Parser)).parse('<a id="mlh-trust-badge" style="display:block;max-width:100px;min-width:60px;position:fixed;right:50px;top:0;width:10%;z-index:10000" href="https://mlh.io/eu?utm_source=eu-hackathon&utm_medium=TrustBadge&utm_campaign=2023-season&utm_content=blue" target="_blank"><img src="https://s3.amazonaws.com/logged-assets/trust-badge/2023/mlh-trust-badge-2023-blue.svg" alt="Major League Hacking 2023 Hackathon Season" style="width:100%"></a>'),Z=function(){return K};var $=function(){return Object(c.jsxs)("div",{className:"App",children:[Object(c.jsx)(Z,{}),Object(c.jsx)(b,{logoPath:r,navElements:[{name:"About Us",href:"#about-us"},{name:"FAQ",href:"#faq"}]}),Object(c.jsx)(X,{path:"/"})]})},ee=function(e){e&&e instanceof Function&&a.e(3).then(a.bind(null,144)).then((function(t){var a=t.getCLS,n=t.getFID,o=t.getFCP,i=t.getLCP,s=t.getTTFB;a(e),n(e),o(e),i(e),s(e)}))};s.a.render(Object(c.jsx)(o.a.StrictMode,{children:Object(c.jsx)($,{})}),document.getElementById("root")),ee()},59:function(e,t,a){},60:function(e,t,a){},61:function(e,t,a){},62:function(e,t,a){},64:function(e,t,a){},65:function(e,t,a){},66:function(e,t,a){},78:function(e,t,a){},79:function(e,t,a){},81:function(e,t,a){},82:function(e,t,a){},83:function(e,t,a){}},[[141,1,2]]]);
//# sourceMappingURL=main.425fac7d.chunk.js.map