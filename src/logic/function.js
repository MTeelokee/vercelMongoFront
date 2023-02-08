import axios from "axios";

const AddEvent = (idEvent) => {
  axios
    .get(
      `https://vercel-mongo-test-integration-9hli1m9ud-mteelokee.vercel.app/request/event/${idEvent}`
    )
    .then((res) => console.log(res.data))

    .catch((err) => {
      console.log(err);
    });
};

const colorTagMatcher = (tag) => {
  const b = [
    { Concert: "#D8D4F2" },
    { Musique: "#2C666E" },
    { Atelier: "#824C71" },
    { Enfants: "#827081" },
    { Loisirs: "#B36A5E" },
    { Littérature: "#284B63" },
    { Conférence: "#704C5E" },
    { Théâtre: "#3A5743" },
    { Expo: "#C4B2BC" },
    { Cinéma: "#5A9367" },
    { Danse: "#5CAB7D" },
    { "Art contemporain": "#C97C5D" },
    { "Spectacle musical": "#3B7080" },
    { Sport: "#44633F" },
    { Histoire: "#0A090C" },
    { Innovation: "#88A09E" },
    { Balade: "#706993" },
    { Nature: "#153243" },
    { Peinture: "#4A2545" },
    { Photo: "#331E38" },
    { Solidarité: "#78290F" },
    { Clubbing: "#FF36AB" },
    { LGBT: "#642CA9" },
    { "Jeux 2024": "#D81E5B" },
    { Humour: "#D19C1D" },
    { Sciences: "#70A0AF" },
    { BD: "#EB5E55" },
    { "Street-art": "#3A3335" },
    { Gourmand: "#B88C9E" },
    { Cirque: "#FF7D00" },
    { Salon: "#8DA1B9" },
    { Brocante: "#646E68" },
    { Santé: "#3F4B3B" },
    { Divers: "#3F4B3B" },
  ];
  let col = b.filter((e) => e[tag]);
  return String(Object.values(col[0]));
};

// const axiosFetch = async (url,testData) => {
//   try {
//     const callData = await axios.get(
//       url
//     );
//     testData(callData.data.records);
//   } catch (err) {
//     console.log(err);
//   }
// }

export { AddEvent, colorTagMatcher };
