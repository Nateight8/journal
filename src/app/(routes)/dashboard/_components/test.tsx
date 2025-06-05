import DailyPnlWidget from "./widgets/daily-pnl";
import Welcome from "./widgets/welcome";

export default function Page() {
  return (
    <>
      <div className="p-4 md:p-6 gap-4 grid lg:grid-cols-4 lg:gap-6 border border-red-800">
        <Welcome />
        <DailyPnlWidget pnlData={pnlData} />
      </div>
    </>
  );
}
