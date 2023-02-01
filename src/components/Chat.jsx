import { Divider, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db, messageChainsRef } from "../App";

export default function Chat(props) {
    const [chain, setChain] = useState();
    const [messages,setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    async function createMessageChain() {


    }
    async function getMessageChain() {
      const q = query(
        messageChainsRef,
        where("__name__", "==", props.friend.message_chain)
      );
      const querySnapshot = await getDocs(q);
      let i;
      //This could cause bugs if there is more than one result for query
      querySnapshot.forEach((doc) => {
        if (doc.exists()) {
          i = doc;
          console.log(doc.id);
        } else {
          console.log("Could not retrieve message_chain");
        }
      });
      return i;
    }
    async function getAndCreateMessageChain(){
        const chain = await getMessageChain();
        setChain(chain);
        if(!chain){
            const createChain = await createMessageChain();
            setChain(createChain);
        }
    }
    async function getMessageCollection(){
        const messageCollectionRef = collection(db, "message_chains", props.friend.message_chain, "messages" );
        const querySnapshot = await getDocs(messageCollectionRef);
        const temp = [];
        querySnapshot.forEach(message => {
            if (message.exists()) {
                temp.push(message.data());
              } else {
                console.log("Could not retrieve message");
              }
        });
        return temp;
    }
    async function createMessageCollection() {

    }
    async function getAndCreateMessageCollection(){
        const messageArray = await getMessageCollection();
        console.log(messageArray);
        setMessages([...messageArray]);
        if(!messageArray){
            const createMessage = await createMessageCollection();
            setMessages([...createMessage]);
        }
    }
    getAndCreateMessageChain();
    getAndCreateMessageCollection();
    setLoading(false);
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        flexDirection: "column",
        color: "white",
      }}
    >
      <Typography
        variant="h4"
        sx={{ paddingTop: "10px", paddingBottom: "8px" }}
      >
        Chat
      </Typography>
      <Divider variant="fullWidth" />
      {loading ? <Box>Loading</Box> : messages.map((el,index) => {
        return(
            <Box key={index}>{el.content}</Box>    
        )
      })}
    </Box>
  );
}
