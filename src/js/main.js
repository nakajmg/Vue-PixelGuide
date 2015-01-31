var guidelines = new Guidelines({
  data: {
    horizon: [
      60, 75, 80, 140
    ],
    vertical: [
      90, 120, 150, 300
    ]
  }
});
var rulers = new Rulers();

guidelines.$mount();
guidelines.$appendTo('body');
rulers.$mount();
rulers.setGuidelines(guidelines);
rulers.$appendTo(`${prefix}rulers`);
