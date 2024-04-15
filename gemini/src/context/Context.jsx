import { createContext , useState } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) =>{

    const [input , setInput ] = useState("");
    const [recentPrompt , setRecentPrompt] = useState("");
    const [previousPrompts, setPreviousPrompts] = useState([]);
    const [showResult , setShowResult] = useState(false);
    const [loading , setLoading] = useState(false);
    const [resultData , setResultData] = useState("");
    
    const delayPara = (index,nextWord) =>{
          setTimeout(() =>{
                setResultData((prev) => prev+nextWord);
          },75*index)
    }

    const newChat = ()=>{
        setLoading(false);
        setShowResult(false);

    }

    const onSent = async(prompt)=>{
            setResultData("");
            setLoading(true);
            setShowResult(true);
            let response ;
            if(prompt !== undefined)
            {
                 response = await runChat(prompt);
                 setRecentPrompt(prompt);
            }
            else{
                const newPrev = [...previousPrompts , input];
                setPreviousPrompts(newPrev);
                setRecentPrompt(input);
                 response = await runChat(input);
            }

            let responseArray = response.split("**");
            let newResponse="";
            for(let i = 0;i<responseArray.length ;i++)
            {
                 if(i%2==0)
                 {
                    newResponse+= responseArray[i];
                 }
                 else{
                    newResponse+="<b>" + responseArray[i] + "</b>";
                 }
            }
            console.log("this is from context" , newResponse);
            let newResponse2 = newResponse.split('*').join("</br>");
            let newResponseArray = newResponse2.split(" ");

            for(let i =0;i<newResponseArray.length;i++)
            {
                
                 const nextWord = newResponseArray[i];
                 console.log(nextWord);
                 delayPara(i,nextWord+" ");

            }
            // setResultData(newResponse2);
            setLoading(false);
            setInput("");
    };


    const contextValue = {
           previousPrompts,
           setPreviousPrompts,
           onSent,setRecentPrompt,recentPrompt,showResult,loading,resultData,input,setInput,newChat
    }
    return(
        <Context.Provider value= {contextValue}>
            {props.children};
        </Context.Provider>
    )
};

export default ContextProvider;