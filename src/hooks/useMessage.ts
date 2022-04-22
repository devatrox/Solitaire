import { useEffect, useState } from "react";

const useMessage = (): [
    string,
    React.Dispatch<React.SetStateAction<string>>,
] => {
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (message.length > 0) {
            window.setTimeout(() => setMessage(""), 4000);
        }
    }, [message]);

    return [message, setMessage];
};

export default useMessage;
