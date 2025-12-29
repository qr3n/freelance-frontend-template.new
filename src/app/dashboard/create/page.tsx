import "react-device-frameset/styles/marvel-devices.min.css";
import { Montserrat } from "next/font/google";
import { CreateBotSteps } from '@/widgets/bot-creation/ui/CreateBotSteps';

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export default function CreateBotPage() {
  return (
    <div className={montserrat.className}>
      <CreateBotSteps />
    </div>
  );
}
