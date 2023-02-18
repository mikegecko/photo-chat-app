import {
  Button,
  ButtonBase,
  CircularProgress,
  Divider,
  Input,
  InputBase,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { useEffect, useReducer, useRef, useState } from "react";
import { db, messageChainsRef, usersRef } from "../App";
import SendIcon from "@mui/icons-material/Send";
import StyledMessage from "./StyledMessage";
import StyledImageMessage from "./StyledImageMessage";

export default function Chat(props) {
  const [chain, setChain] = useState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageChainID, setMessageChainID] = useState(null);
  const [messageToSend, setMessageToSend] = useState(null);
  const [tempMessage, setTempMessage] = useState(null);
  const [messageToUpdate, setMessageToUpdate] = useState(null);

  let mountRef = useRef(true);
  let idMountRef = useRef(true);


  // Sorts messages based on timestamp -> firebase has a built in system for returning documents ordered by timestamp
  const compareTimestamp = (a, b) => {
    if (a.timestamp > b.timestamp) {
      return -1;
    }
    if (a.timestamp < b.timestamp) {
      return 1;
    }
    return 0;
  };
  const handleSendEvent = (e) => {
    setTempMessage("");
    setMessageToSend(tempMessage);
  };
  const handleInputChangeEvent = (e) => {
    setTempMessage(e.target.value);
  };

  const setStateOfMessageToUpdate = (messageObj) => {
    setMessageToUpdate(messageObj);
  }
  //Handles message_chain document in firestore
  useEffect(() => {
    
    setLoading(true);
    async function setFriendMessageChain (chainID) {
      const userRef = doc(db, "users", props.userData.friends[props.friend].id);
      const friendSnap = await getDoc(userRef);
      if(friendSnap.exists()){
        let userIndex = null;
        friendSnap.data().friends.forEach((el,index) => {
          if(el.id === props.userID){
            userIndex = index;
          }
        })
        const newFriends = {friends: [...friendSnap.data().friends]};
        newFriends.friends[userIndex].message_chain = chainID;
        await setDoc( userRef, newFriends , {merge: true});
      }
      else{
        console.log("Error getting user for message_chain creation.")
      }
      
    }
    async function createMessageChain() {
      try {
        const docRef = await addDoc(collection(db, "message_chains"), {
          timestamp: serverTimestamp(),
          users: [props.userID, props.userData.friends[props.friend].id],
        });
        
        const newUserData = {
          ...props.userData,
          friends: [...props.userData.friends],
        };
        newUserData.friends[props.friend].message_chain = docRef.id;
        props.setStateOfUserData(newUserData);
        await setFriendMessageChain(docRef.id);

        return docRef;
      } catch (error) {
        console.error(error);
      }
    }
    async function getMessageChain() {
      try {
        const q = query(
          messageChainsRef,
          where(
            "__name__",
            "==",
            props.userData.friends[props.friend].message_chain
          )
        );
        const querySnapshot = await getDocs(q);
        //console.log("Queried");
        let i;
        //This could cause bugs if there is more than one result for query
        querySnapshot.forEach((doc) => {
          if (doc.exists()) {
            i = doc;
            //console.log(doc.id);
          } else {
            console.log("Could not retrieve message_chain");
          }
        });
        return i;
      } catch (error) {
        console.error(error);
      }
    }
    
    async function getAndCreateMessageChain() {
      const chain = await getMessageChain();
      if (!chain) {
        const createChain = await createMessageChain();
        setMessageChainID(createChain.id);
        // Somehow get this id to update message_chain prop and update document in DB
        setChain(createChain);
      } else {
        setMessageChainID(props.userData.friends[props.friend].message_chain);
        setChain(chain);
      }
    }
// !!! useRef workaround is ill-advised, look into other solutions
    if (mountRef.current) {
      mountRef.current = false;
      //console.log(messageChainID);
      getAndCreateMessageChain();
      //getAndCreateMessageCollection();
    }

    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => {
      //Cleanup useEffect
      //console.log("Cleanup Chat");
      clearTimeout(timer);
      //mountRef.current = true;
    };
  }, []);
  // messageChainID issues with being undefined so I moved it here...maybe there's a better solution
  //Handles messages collection in firestore
  useEffect(() => {
    //console.log(messageChainID);
    async function getMessageCollection() {
      const querySnapshot = await getDocs(
        collection(db, `message_chains/${messageChainID}/messages`)
      );
      //console.log("Collecting Messages");
      const messageArray = [];
      querySnapshot.forEach((message) => {
        if (message.exists()) {
          messageArray.push(message.data());
        } else {
          console.log("Could not retrieve message");
        }
      });
      return messageArray;
    }
    async function createMessageCollection() {
      // Make this first message more unique and add data - this first message will be hidden from the convo and serve as a data manager for the convo
      const docRef = await addDoc(
        collection(db, `message_chains/${messageChainID}/messages`),
        {
          content: "New Convo",
          sender: "test",
          timestamp: serverTimestamp(),
        }
      );
      await setDoc(docRef, {docId: docRef.id}, {merge: true});

      //console.log("Creating New Messages");
      //console.log(docRef.id);
      return docRef;
    }
    // Subscribes to firebase events to update messages
    async function subscribeToFirestoreMessaging () {
      const q = query(collection(db, `message_chains/${messageChainID}/messages`))
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const m = [];
        const sources = [];
        let serverFlag = false;
        querySnapshot.forEach((doc) => {
          const source = doc.metadata.hasPendingWrites ? "Local" : "Server";
          if(source === "Server"){
            serverFlag = true;
          }
          sources.push(source);
          m.push(doc.data());
        });
        if(serverFlag){
          setMessages([...m]);
        }
      })
    }
    
    async function getAndCreateMessageCollection() {
      //console.log("Started Message Collection...");
      const messageArray = await getMessageCollection();
      if (!messageArray[0]) {
        const createMessage = await createMessageCollection();
        //setMessages([...createMessage]);
        const addMessage = await getMessageCollection();
        setMessages([...addMessage]);
        subscribeToFirestoreMessaging();
      } else {
        setMessages([...messageArray]);
        subscribeToFirestoreMessaging();
      }
    }
    if (idMountRef.current) {
      //idMountRef.current = false;
      if (messageChainID) {
        getAndCreateMessageCollection();
      }
    }
    return () => {
      //Cleanup
    };
  }, [messageChainID]);
  // This useEffect handles sending messages to DB and refreshing the messages state
  useEffect(() => {
    async function getMessageCollection() {
      const querySnapshot = await getDocs(
        collection(db, `message_chains/${messageChainID}/messages`)
      );
      console.log("Collecting Messages");
      const messageArray = [];
      querySnapshot.forEach((message) => {
        if (message.exists()) {
          messageArray.push(message.data());
        } else {
          console.log("Could not retrieve message");
        }
      });
      return messageArray;
    }
    async function sendMessage(messageText) {
      try {
        const docRef = await addDoc(
          collection(db, `message_chains/${messageChainID}/messages`),
          {
            content: messageText,
            sender: props.userID,
            timestamp: serverTimestamp(),
          }
        );
        await setDoc(docRef, {docId: docRef.id}, {merge: true});
        //console.log("Sending message");
        //console.log(docRef.id);
        return docRef;
      } catch (error) {
        console.error(error);
      }
    }
    async function messageWrapFunc() {
      await sendMessage(messageToSend);
      //Collect new messages
      const messageArray = await getMessageCollection();
      setMessages([...messageArray]);
    }
    if (messageToSend !== null) {
      messageWrapFunc();
    }
    return () => {
      if (messageToSend == null) {
        return;
      } else {
        setMessageToSend(null);
      }
    };
  }, [messageToSend]);
  useEffect(() => {
    async function updateMessageStatus(){
      console.log('Update Message');
      console.log(messageToUpdate);
      const docRef = doc(db, `message_chains/${messageChainID}/messages`, messageToUpdate.docId);
      await setDoc(docRef, { viewed: true}, {merge: true});
    }
    if(messageToUpdate !== null){
      updateMessageStatus();
    }
    return () => {
      setMessageToUpdate(null);
    }
  }, [messageToUpdate])


  //Debugging state
  useEffect(() => {
    console.log(messages);
  }, [messages]);

  //Desktop View
  if(!props.mobileView){
    return (
      <ThemeProvider theme={props.theme}>
        <Box
          sx={{
            display: "flex",
            height: "100%",
            flexDirection: "column",
          }}
        >
        <Typography
          variant="h4"
          sx={{ paddingTop: "10px", paddingBottom: "8px" }}
        >
          Chat
        </Typography>
        <Divider variant="fullWidth" />
        <Box
          sx={{
            display: "flex",
            height: "100%",
            maxHeight: "100%",
            flexDirection: "column-reverse",
            overflowY: "scroll",
          }}
        >
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "1rem",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            messages.sort(compareTimestamp).map((el, index) => {
              if(el.imageURL){
                return(
                  <StyledImageMessage
                  theme={props.theme}
                  key={index}
                  userID={props.userID}
                  message={el}
                  id={index} />
                )
              }
              else{
                return (
                  <StyledMessage
                    theme={props.theme}
                    key={index}
                    userID={props.userID}
                    message={el}
                    id={index}
                  />
                );
              }
            })
          )}
        </Box>
        <Box
          sx={{
            bgcolor: "#0060c1",
            padding: "8px",
            display: "flex",
            flexDirection: "row",
            gap: "8px",
          }}
        >
          <InputBase
            value={tempMessage}
            sx={{
              bgcolor: props.theme.palette.background.default,
              borderRadius: ".5rem",
              paddingLeft: "8px",
              height: "2.7rem",
              width: "100%",
              display: "flex",
              alignItems: "center",
            }}
            placeholder="Send Message..."
            variant="outlined"
            size="small"
            onChange={handleInputChangeEvent}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendEvent();
              }
            }}
          />
          <Button variant="contained" color="success" onClick={handleSendEvent}>
            <SendIcon />
          </Button>
        </Box>
        </Box>
      </ThemeProvider>
    );
  }
  //Mobile view
  else{
    return (
      <ThemeProvider theme={props.theme}>
        
        <Typography
          variant="h4"
          sx={{ paddingTop: "10px", paddingBottom: "8px" }}
        >
          Chat
        </Typography>
        <Divider variant="fullWidth" />
        <Box
          sx={{
            display: "flex",
            height: "calc(100%)",
            maxHeight: "calc(100%)",
            flexDirection: "column-reverse",
            overflowY: "scroll",
          }}
        >
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "1rem",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            messages.sort(compareTimestamp).map((el, index) => {
              if(el.imageURL){
                return(
                  <StyledImageMessage
                  setStateOfMessageToUpdate={setStateOfMessageToUpdate}
                  mobileView={props.mobileView}
                  theme={props.theme}
                  key={index}
                  userID={props.userID}
                  message={el}
                  id={index} />
                )
              }
              else{
                return (
                  <StyledMessage
                    theme={props.theme}
                    key={index}
                    userID={props.userID}
                    message={el}
                    id={index}
                  />
                );
              }
            })
          )}
        </Box>
        <Box
          sx={{
            bgcolor: "#0060c1",
            padding: "8px",
            display: "flex",
            flexDirection: "row",
            gap: "8px",
          }}
        >
          <InputBase
            value={tempMessage}
            sx={{
              bgcolor: props.theme.palette.background.default,
              borderRadius: ".5rem",
              paddingLeft: "8px",
              height: "2.7rem",
              width: "100%",
              display: "flex",
              alignItems: "center",
            }}
            placeholder="Send Message..."
            variant="outlined"
            size="small"
            onChange={handleInputChangeEvent}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendEvent();
              }
            }}
          />
          <Button variant="contained" color="success" onClick={handleSendEvent}>
            <SendIcon />
          </Button>
        </Box>
      </ThemeProvider>
    );
  }
}
