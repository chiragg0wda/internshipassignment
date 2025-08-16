import { useState } from "react";
import { InputField } from "./components/InputField";

export default function App() {
  const [value, setValue] = useState("");
  return (
    <div className="min-h-screen p-6 bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <div className="max-w-sm">
        <InputField
          label="Username"
          placeholder="Enter username"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          helperText="This is helper text"
          variant="outlined"
          size="md"
        />
      </div>
    </div>
  );
}
