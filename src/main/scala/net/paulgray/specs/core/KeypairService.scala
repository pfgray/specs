package net.paulgray.specs.core

import java.security.{KeyPair, KeyPairGenerator}

import org.apache.commons.codec.binary.Base64

object KeypairService {

  import java.nio.charset.Charset

  private val UTF8_CHARSET = Charset.forName("UTF-8")

  def decodeUTF8(bytes: Array[Byte]) = new String(bytes, UTF8_CHARSET)

  def encodeUTF8(string: String): Array[Byte] = string.getBytes(UTF8_CHARSET)

  def generateKeypair(): KeyPair = {
    val keyGen = KeyPairGenerator.getInstance("RSA")
    keyGen.initialize(512)
    keyGen.genKeyPair()
  }

  implicit class KeyPairOps(keyPair: KeyPair) {
    def getEncoded: (String, String) = {
      (keyPair.getPrivate.getEncoded.base64Encoded,
       keyPair.getPublic.getEncoded.base64Encoded)
    }
  }

  implicit class ByteArrayOps(a: Array[Byte]) {
    def base64Encoded: String =
      Base64.encodeBase64String(a)
  }

}
