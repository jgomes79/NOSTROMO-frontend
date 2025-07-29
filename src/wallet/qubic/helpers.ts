// src/context/QubicConnectContext.js

import Crypto, { SIGNATURE_LENGTH } from "@qubic-lib/qubic-ts-library/dist/crypto";

// Helper function to sign transactions
export async function localSignTx(qHelper, privateKey, tx) {
  const qCrypto = await Crypto;
  const idPackage = await qHelper.createIdPackage(privateKey);

  const digest = new Uint8Array(qHelper.DIGEST_LENGTH);
  const toSign = tx.slice(0, tx.length - SIGNATURE_LENGTH);

  qCrypto.K12(toSign, digest, qHelper.DIGEST_LENGTH);

  const signature = qCrypto.schnorrq.sign(idPackage.privateKey, idPackage.publicKey, digest);

  tx.set(signature, tx.length - SIGNATURE_LENGTH);
  return tx;
}
