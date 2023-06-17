module.exports = {
  optimization: {
    minimize: false, // mangle false else mysql blow ups with "PROTOCOL_INCORRECT_PACKET_SEQUENCE"
  },
};
