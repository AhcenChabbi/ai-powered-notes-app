import { Brain } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex items-center space-x-2 px-2 py-2">
      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
        <Brain className="w-5 h-5 text-white" />
      </div>
      <span className="text-xl font-bold">AI Notes</span>
    </div>
  );
}
