import React, { useState, useEffect } from "react";
import { ContractKit, newKit } from "@celo/contractkit";
import Web3 from "web3";
import DIDRegistryABI from "../build/contracts/DIDRegistry.json";
import {
Button,
Container,
TextField,
Typography,
Grid,
CircularProgress,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { CheckCircle, Error } from "@material-ui/icons";
const CeloDID = () => {

// State variables and hooks
const [web3, setWeb3] = useState(null);
const [account, setAccount] = useState(null);
const [contract, setContract] = useState(null);
const [loading, setLoading] = useState(true);
const [message, setMessage] = useState(null);
const [name, setName] = useState("");
const [value, setValue] = useState("");
const [validTo, setValidTo] = useState(0); 

// Main logic and event handlers
useEffect(() => {
    const connectCelo = async () => {
      if (window.celo) {
        try {
          const kit = newKit("https://alfajores-forno.celo-testnet.org");
          const web3 = kit.web3;
          setWeb3(web3);

          // Request account access
          await window.celo.enable();

          const accounts = await web3.eth.getAccounts();
          setAccount(accounts[0]);

          const networkId = await web3.eth.net.getId();
          const deployedNetwork = DIDRegistryABI.networks[networkId];
          const instance = new web3.eth.Contract(
            DIDRegistryABI.abi,
            deployedNetwork && deployedNetwork.address
          );
          setContract(instance);
          setLoading(false);
        } catch (error) {
          console.error("Error connecting to Celo:", error);
          setLoading(false);
        }
      } else {
        alert("Celo extension not found!");
        setLoading(false);
      }
    };
    connectCelo();
  }, []);

  const handleSetAttribute = async () => {
    setLoading(true);
    try {
      const tx = await contract.methods
        .setAttribute(
          Web3.utils.stringToHex(name),
          Web3.utils.stringToHex(value),
          validTo
        )
        .send({ from: account });
      setMessage({
        type: "success",
        text: `Attribute set! Transaction hash: ${tx.transactionHash}`,
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: `Error setting attribute: ${error.message}`,
      });
    }
    setLoading(false);
  };

  const handleGetAttribute = async () => {
    setLoading(true);
    try {
      const result = await contract.methods
        .getAttribute(account, Web3.utils.stringToHex(name))
        .call();
      const hexValue = Web3.utils.hexToUtf8(result.value);
      setMessage({
        type: "success",
        text: `Attribute: ${name}, Value: ${hexValue}, ValidTo: ${result.validTo}`,
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: `Error getting attribute: ${error.message}`,
      });
    }
    setLoading(false);
  };


// Render components
return (
    <Container>
      <Typography variant="h4">Celo Decentralized Identity</Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Attribute Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Attribute Value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Valid To (Block Number)"
                type="number"
                value={validTo}
                onChange={(e) => setValidTo(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSetAttribute}
              >
                Set Attribute
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleGetAttribute}
              >
                Get Attribute
              </Button>
            </Grid>
          </Grid>
          {message && (
            <Alert
              severity={message.type}
              icon={message.type === "success" ? <CheckCircle /> : <Error />}
  style={{ marginTop: "1rem" }}
  >
  {message.text}
  </Alert>
  )}
  </>
  )}
  </Container>
  );
};
export default CeloDID;