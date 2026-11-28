// The Kairos Israel 2027 journey plan: the detailed Before / During / After. Served only to pilgrims (by portal token) and the host (by key).
const BEFORE = [
    ["1 · Identity and hearing God", "7 Dec – 3 Jan", "The Summons: who am I before God, and listening prayer through Advent and Christmas", "Identity reflection, first journal entries, assessments"],
    ["2 · Character and prayer", "4 – 31 Jan", "The January fast; prayer rhythm, intercession and the hidden life", "A prayer rule of life"],
    ["3 · Scripture and the land", "1 – 28 Feb", "Every site studied ahead: Carmel, Tabor, Galilee, Jordan, Jerusalem, Elah, Dead Sea", "The site workbook and reading plan"],
    ["4 · Calling and consecration", "1 Mar – 3 Apr", "Gifts and assignment through Lent to Easter; travel readiness", "A calling map and a consecration letter"]
  ];
const DURING = [
    ["Sun 4 Apr", "Tiberias", "Arrive at Ben Gurion, transfer north, rest, welcome dinner, consecration", "The welcome and the first prayer over the family scroll"],
    ["Mon 5 Apr", "Tiberias", "Mount Carmel (the altar and the fire) and Mount Tabor (hearing Christ)", "Families prayed for at Carmel"],
    ["Tue 6 Apr", "Tiberias", "Boat on the Sea of Galilee, Capernaum, Mount of Beatitudes; Peniel Encounter in the evening", "Silence on the water"],
    ["Wed 7 Apr", "Jerusalem", "Yardenit on the Jordan (teaching, optional baptism, prayer), then up to Jerusalem", "The first step into Jerusalem: silence and Scripture before sightseeing"],
    ["Thu 8 Apr", "Jerusalem", "Mount of Olives, Gethsemane, the Old City and the Western Wall; Communion", "Families' written requests placed at the Wall; live prayer broadcast"],
    ["Fri 9 Apr", "Dead Sea", "Valley of Elah (courage over intimidation), then down to the Dead Sea", "Five smooth stones: each pilgrim names a giant"],
    ["Sat 10 Apr", "Dead Sea", "A full retreat day: rest, reflection, optional floating and spa", "Final Commissioning dinner; the blessing over the scroll"],
    ["Sun 11 Apr", "—", "Thanksgiving, then transfer to Ben Gurion for flights home", "The sending prayer; the 90 days begin"]
  ];
const AFTER = [
    ["First 7 days", "11 – 18 Apr", "Hold what was received", "Thanksgiving letter, a testimony prompt, integration call on Thursday 15 April"],
    ["Days 8–30", "19 Apr – 10 May", "Turn insight into practice", "A rule of life and prayer rhythm; how this lands at home, in church and at work"],
    ["Days 31–60", "11 May – 9 Jun", "Accountability", "Formation circles continue, coaching check-ins, a service commitment"],
    ["Days 61–90", "10 Jun – 10 Jul", "Next steps and legacy", "Alumni pathway, mentoring, testimonies; first alumni gathering on Saturday 10 July"]
  ];
const RHYTHM = "<div class=\"grid2\" style=\"margin-top:18px\"><div><h3>The weekly rhythm</h3><ul><li><b>Friday:</b> The Pilgrim’s Letter, with a Word of the Week, a teaching, a prayer and one exercise.</li><li><b>Sunday:</b> The Pilgrim’s Blessing.</li><li>A prayer partner every two weeks.</li><li>One live masterclass each month on Zoom.</li><li>Assessments at the start (gifts, calling, prayer life) shape your coaching.</li></ul></div><div><h3>The readiness countdown</h3><ul><li><b>100 days</b> · 25 December</li><li><b>50 days</b> · 13 February</li><li><b>30 days</b> · 5 March</li><li><b>14 days</b> · 21 March</li><li><b>7 days</b> · Easter Sunday, 28 March</li></ul><p class=\"muted\">Each countdown letter checks your passport (valid 6 months after travel), ETA-IL or group visa, travel insurance and flights (booked by city group by 15 January).</p></div></div>";
const HOTELS = "<p class=\"muted\" style=\"margin-top:12px\">Hotels (or similar): Tiberias, Ron Beach \u00b7 Jerusalem, Grand Court \u00b7 Dead Sea, David Resort. Shabbat runs from sunset on Friday 9 April to sunset on Saturday 10 April: the Valley of Elah is a Friday-morning visit, the coach reaches the Dead Sea before sunset, and Saturday is a rest day at the hotel with no site visits or travel (hotels and meals carry on as normal). Jerusalem and the Western Wall fall on Wednesday and Thursday, when everything is open.</p>";
const KEEP = "<p style=\"margin-top:12px\"><b>What you keep:</b> your formation journal, the commissioning certificate and your Kingdom Life Portfolio. <b>What comes next:</b> the M\u00e1laga Gateway Residency, the School of Apostles &amp; Prophets and the Pilgrim Ambassador programme.</p>";
module.exports = { BEFORE, DURING, AFTER, RHYTHM, HOTELS, KEEP };
