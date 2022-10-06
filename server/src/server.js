import app from "./app";

app.set("PORT", process.env.PORT || 3001);

app.listen(app.get("PORT"), () => {
  console.log(`❗ Runserver http://localhost:${app.get("PORT")}`);
});
