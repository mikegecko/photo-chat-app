import { Divider, Typography } from "@mui/material";
import { create } from "@mui/material/styles/createTransitions";
import { Box } from "@mui/system";
import { addDoc, collection, doc, getDocs, query, serverTimestamp, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db, messageChainsRef } from "../App";

export default function Chat(props) {
    const [chain, setChain] = useState();
    const [messages,setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [messageChainID, setMessageChainID] = useState(null);
    const messageCollectionRef = collection(db, "message_chains", messageChainID, "messages" );
    
  useEffect(() => {
    // Creation methods broken AF probably need to rewrite this whole compoenent...maybe move async stuff into main component?
    // 
    setLoading(true);
    async function createMessageChain() {
        const docRef = await addDoc(messageChainsRef, {
            timestamp:serverTimestamp(),
            users:[props.userData.id, props.firend.id],
          });
          return docRef;
          // This docRef.id needs to be added to message_chain in firestore for both users
          // For current user -> call setStateOfUserData() to update
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
        if(!chain){
            const createChain = await createMessageChain();
            setMessageChainID(createChain.id);
            // Somehow get this id to update message_chain prop and update document in DB
            setChain(createChain);
        }
        else{
          setChain(chain);
        }
    }
    async function getMessageCollection(){
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
        const docRef = await addDoc(messageCollectionRef, {
            content:'New Convo'
          });
        const temp = [];
        temp.push(docRef.data());
          return(temp);
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
    //getAndCreateMessageCollection();
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
