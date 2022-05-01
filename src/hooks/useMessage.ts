import { useEffect } from "react";
import { useImmer } from "use-immer";

const useMessage = (): [
    string,
    React.Dispatch<React.SetStateAction<string>>,
] => {
    const [message, setMessage] = useImmer("");

    useEffect(() => {
        if (message.length > 0) {
            window.setTimeout(() => setMessage(""), 4000);
        }
    }, [message, setMessage]);

    return [message, setMessage];
};

export default useMessage;
