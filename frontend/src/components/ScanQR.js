import React, { useEffect } from "react";

import { Html5QrcodeScanner }
from "html5-qrcode";

export default function ScanQR() {

  useEffect(() => {

    const scanner =
      new Html5QrcodeScanner(

        "reader",

        {
          qrbox: {
            width: 250,
            height: 250
          },

          fps: 5
        },

        false
      );

    scanner.render(

      // SUCCESS
      (decodedText) => {

        console.log(decodedText);

        alert(`QR Scanned: ${decodedText}`);

      },

      // ERROR
      (error) => {

        console.log(error);

      }
    );

  }, []);

  return (

    <div
      style={{
        marginTop: "30px",
        textAlign: "center"
      }}
    >

      <h2>Scan QR Code</h2>

      <div
        id="reader"
        style={{
          width: "400px",
          margin: "auto"
        }}
      ></div>

    </div>
  );
}