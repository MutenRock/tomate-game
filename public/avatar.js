// Petit personnage SVG habillable. La bouche (.mouth) est pilotée par la variable CSS --open (0 → 1).
// Les couleurs de peau viennent de content/costumes.json ; le reste est dessiné ici.

const OUTFITS = {
  tshirt: { body: "#3b6ea5", sleeve: "#3b6ea5", extra: `<circle cx="100" cy="190" r="11" fill="#fff" opacity=".9"/><circle cx="100" cy="190" r="6" fill="#e5382c"/>` },
  king: { body: "#b3262d", sleeve: "#b3262d", extra: `<ellipse cx="100" cy="153" rx="38" ry="11" fill="#fff"/><g fill="#2a1a15"><circle cx="78" cy="154" r="2.5"/><circle cx="92" cy="159" r="2.5"/><circle cx="108" cy="159" r="2.5"/><circle cx="122" cy="154" r="2.5"/></g><g fill="#f0bd4f"><circle cx="100" cy="182" r="5"/><circle cx="100" cy="202" r="5"/><circle cx="100" cy="222" r="5"/></g>` },
  tux: { body: "#1f1f26", sleeve: "#1f1f26", extra: `<path d="M84 150 L100 196 L116 150Z" fill="#fff"/><g fill="#1f1f26"><circle cx="100" cy="176" r="2.4"/><circle cx="100" cy="190" r="2.4"/></g><path d="M84 150 L100 170 L92 150Z M116 150 L100 170 L108 150Z" fill="#111"/>` },
  dress: { body: "#7a3fa0", sleeve: "#7a3fa0", shape: "M62 176 C62 158 80 148 100 148 C120 148 138 158 138 176 L160 232 C160 240 152 242 146 242 L54 242 C48 242 40 240 40 232 Z", extra: `<rect x="64" y="176" width="72" height="9" fill="#f47fa8"/><circle cx="100" cy="180" r="6" fill="#f0bd4f"/>` },
  armor: { body: "#aab3bd", sleeve: "#8d97a2", extra: `<path d="M72 160 H128 M100 160 V232" stroke="#6d7782" stroke-width="3" fill="none"/><g fill="#6d7782"><circle cx="76" cy="176" r="3"/><circle cx="124" cy="176" r="3"/><circle cx="76" cy="214" r="3"/><circle cx="124" cy="214" r="3"/></g>` },
  space: { body: "#f1f1f1", sleeve: "#f1f1f1", extra: `<rect x="58" y="196" width="84" height="10" fill="#ff8a1f"/><circle cx="80" cy="176" r="8" fill="#315b79"/><rect x="104" y="170" width="24" height="12" rx="3" fill="#cfd6dd"/><ellipse cx="100" cy="151" rx="34" ry="8" fill="#cfd6dd"/>` },
  vamp: { body: "#1b1018", sleeve: "#1b1018", extra: `<path d="M84 150 L100 200 L116 150Z" fill="#8f1a2c"/><path d="M60 150 L80 132 L84 158Z M140 150 L120 132 L116 158Z" fill="#1b1018" stroke="#8f1a2c" stroke-width="2"/>` },
  apron: { body: "#4d7ea8", sleeve: "#4d7ea8", extra: `<path d="M70 160 H130 L136 238 H64Z" fill="#efe8d8"/><path d="M74 160 L86 150 M126 160 L114 150" stroke="#efe8d8" stroke-width="5"/><rect x="82" y="196" width="36" height="20" rx="4" fill="#e2d8c2"/><circle cx="100" cy="176" r="5" fill="#c0392b"/>` },
  ghost: { body: "#f7f7fb", sleeve: "#f7f7fb", shape: "M54 168 C54 154 76 148 100 148 C124 148 146 154 146 168 L150 240 L134 230 L120 242 L100 230 L80 242 L66 230 L50 240 Z", extra: "" },
  robot: { body: "#8fa3b3", sleeve: "#6f8393", extra: `<rect x="72" y="166" width="56" height="44" rx="6" fill="#c5d2dc" stroke="#5c6f7e" stroke-width="2"/><circle cx="88" cy="182" r="5" fill="#e5382c"/><circle cx="112" cy="182" r="5" fill="#4fb04a"/><rect x="86" y="194" width="28" height="6" rx="2" fill="#5c6f7e"/>` }
};

const HATS = {
  none: "",
  crown: `<path d="M62 52 L66 20 L84 38 L100 12 L116 38 L134 20 L138 52Z" fill="#f0bd4f" stroke="#b8862b" stroke-width="3" stroke-linejoin="round"/><circle cx="100" cy="34" r="5" fill="#e5382c"/><circle cx="76" cy="42" r="3.5" fill="#4aa3df"/><circle cx="124" cy="42" r="3.5" fill="#4aa3df"/>`,
  tophat: `<rect x="70" y="-12" width="60" height="62" rx="5" fill="#1d1d24"/><rect x="70" y="30" width="60" height="9" fill="#b3262d"/><ellipse cx="100" cy="50" rx="58" ry="10" fill="#1d1d24"/>`,
  beret: `<g transform="rotate(-9 100 44)"><ellipse cx="100" cy="44" rx="54" ry="21" fill="#c0392b"/><circle cx="100" cy="22" r="5" fill="#c0392b"/></g>`,
  toque: `<g fill="#fff" stroke="#ddd" stroke-width="2"><circle cx="76" cy="22" r="22"/><circle cx="124" cy="22" r="22"/><circle cx="100" cy="10" r="26"/></g><rect x="70" y="30" width="60" height="24" rx="5" fill="#fff" stroke="#ddd" stroke-width="2"/>`,
  wizard: `<path d="M60 54 L106 -22 L142 54Z" fill="#5b3a9a"/><g fill="#f0bd4f"><circle cx="100" cy="22" r="4"/><circle cx="116" cy="38" r="3"/><circle cx="92" cy="40" r="2.5"/></g><ellipse cx="100" cy="54" rx="62" ry="11" fill="#4a2e80"/>`,
  helmet: `<path d="M46 68 C46 30 72 16 100 16 C128 16 154 30 154 68Z" fill="#aab3bd" stroke="#6d7782" stroke-width="3"/><rect x="97" y="64" width="6" height="40" fill="#8d97a2"/><path d="M100 16 C96 -6 120 -10 128 4 C116 4 108 8 104 18Z" fill="#e5382c"/>`,
  antenna: `<g stroke="#4a4a55" stroke-width="4" stroke-linecap="round"><path d="M78 42 L62 4"/><path d="M122 42 L138 4"/></g><circle cx="61" cy="2" r="7" fill="#e5382c"/><circle cx="139" cy="2" r="7" fill="#4fb04a"/>`
};

const ACCESSORIES = {
  none: "",
  glasses: `<g fill="#fff" fill-opacity=".25" stroke="#2a1a15" stroke-width="4"><circle cx="78" cy="94" r="18"/><circle cx="122" cy="94" r="18"/></g><path d="M96 94 H104" stroke="#2a1a15" stroke-width="4"/>`,
  sunglasses: `<g fill="#14141a"><rect x="58" y="80" width="40" height="26" rx="10"/><rect x="102" y="80" width="40" height="26" rx="10"/></g><path d="M98 90 H102" stroke="#14141a" stroke-width="4"/><path d="M66 86 L74 86" stroke="#fff" stroke-width="3" opacity=".5"/>`,
  monocle: `<circle cx="122" cy="94" r="19" fill="#fff" fill-opacity=".2" stroke="#d29a2c" stroke-width="4"/><path d="M135 108 C146 130 140 150 134 168" fill="none" stroke="#d29a2c" stroke-width="2.5"/>`,
  mustache: `<path d="M66 128 C78 112 96 118 100 127 C104 118 122 112 134 128 C122 136 106 130 100 132 C94 130 78 136 66 128Z" fill="#2a1a15"/>`,
  bowtie: `<path d="M100 156 L74 144 L74 168Z M100 156 L126 144 L126 168Z" fill="#c0392b" stroke="#7d1018" stroke-width="2"/><circle cx="100" cy="156" r="6" fill="#7d1018"/>`,
  fangs: `<path d="M86 131 L93 131 L89.5 145Z M107 131 L114 131 L110.5 145Z" fill="#fff" stroke="#ddd" stroke-width="1"/>`,
  freckles: `<g fill="#8a4a2a" opacity=".55"><circle cx="58" cy="114" r="2.2"/><circle cx="66" cy="120" r="2.2"/><circle cx="72" cy="112" r="2.2"/><circle cx="142" cy="114" r="2.2"/><circle cx="134" cy="120" r="2.2"/><circle cx="128" cy="112" r="2.2"/></g>`
};

const SKINS = { tomato: "#e5503f", peach: "#f6c7a0", tan: "#d79b6a", cocoa: "#8a5a3c", mint: "#8fd6b0", sky: "#8cc4ee", lavender: "#c3a6ea", banana: "#f4d964" };
const BODY = "M58 200 C58 160 78 148 100 148 C122 148 142 160 142 200 L142 226 C142 234 134 238 126 238 L74 238 C66 238 58 234 58 226Z";

export function avatarSvg(avatar = {}, { id = "", crop = "full", label = "" } = {}) {
  const skin = SKINS[avatar.skin] || SKINS.peach;
  const outfit = OUTFITS[avatar.outfit] || OUTFITS.tshirt;
  const hat = HATS[avatar.hat] ?? "";
  const accessory = ACCESSORIES[avatar.accessory] ?? "";
  const viewBox = crop === "head" ? "26 -24 148 196" : "10 -24 180 280";
  const sleeves = avatar.outfit === "ghost" ? "" : `<g fill="${outfit.sleeve}"><ellipse cx="50" cy="190" rx="12" ry="28" transform="rotate(10 50 190)"/><ellipse cx="150" cy="190" rx="12" ry="28" transform="rotate(-10 150 190)"/></g><g fill="${skin}"><circle cx="47" cy="217" r="9"/><circle cx="153" cy="217" r="9"/></g>`;
  const bowtie = avatar.accessory === "bowtie" ? ACCESSORIES.bowtie : "";
  const faceAccessory = avatar.accessory === "bowtie" ? "" : accessory;
  return `<svg class="avatar" data-avatar="${id}" viewBox="${viewBox}" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg">
<ellipse cx="100" cy="246" rx="52" ry="7" fill="#000" opacity=".25"/>
<g fill="#2b1b16"><ellipse cx="80" cy="241" rx="17" ry="8"/><ellipse cx="120" cy="241" rx="17" ry="8"/></g>
${sleeves}
<path d="${outfit.shape || BODY}" fill="${outfit.body}"/>${outfit.extra}${bowtie}
<g fill="${skin}"><circle cx="40" cy="100" r="11"/><circle cx="160" cy="100" r="11"/></g>
<circle cx="100" cy="98" r="62" fill="${skin}"/>
<ellipse cx="78" cy="62" rx="20" ry="10" fill="#fff" opacity=".22" transform="rotate(-25 78 62)"/>
<g fill="#ff6f7a" opacity=".32"><circle cx="62" cy="120" r="9"/><circle cx="138" cy="120" r="9"/></g>
<g class="eyes"><ellipse cx="78" cy="94" rx="13" ry="15" fill="#fff"/><ellipse cx="122" cy="94" rx="13" ry="15" fill="#fff"/><circle cx="80" cy="97" r="7" fill="#2a1a15"/><circle cx="120" cy="97" r="7" fill="#2a1a15"/><circle cx="82" cy="94" r="2.4" fill="#fff"/><circle cx="122" cy="94" r="2.4" fill="#fff"/></g>
<ellipse cx="100" cy="115" rx="5" ry="3.6" fill="#000" opacity=".14"/>
<g transform="translate(100 130)"><path class="smile" d="M-15 3 Q0 13 15 3" fill="none" stroke="#4a0f1a" stroke-width="3.5" stroke-linecap="round"/><g class="mouth"><path d="M-19 0 Q0 -4 19 0 Q17 26 0 28 Q-17 26 -19 0Z" fill="#4a0f1a"/><ellipse cx="0" cy="20" rx="10" ry="6" fill="#e8606e"/></g></g>
${faceAccessory}
${hat}
</svg>`;
}
