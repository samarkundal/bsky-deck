const { BskyAgent } = require('@atproto/api');
const { jwtDecode } = require('jwt-decode');
const moment = require('moment');

const agent = new BskyAgent({
  service: 'https://bsky.social',
});

const username = 'bskydeck.com';
const password = 'bsky@CLOUD0';

const token = "eyJ0eXAiOiJhdCtqd3QiLCJhbGciOiJFUzI1NksifQ.eyJzY29wZSI6ImNvbS5hdHByb3RvLmFjY2VzcyIsInN1YiI6ImRpZDpwbGM6ZGNnbnA1anlmNWdlb2xnNnFod2ZqcWk2IiwiaWF0IjoxNzM0NDMyOTExLCJleHAiOjE3MzQ0NDAxMTEsImF1ZCI6ImRpZDp3ZWI6c2NhbHljYXAudXMtd2VzdC5ob3N0LmJza3kubmV0d29yayJ9.kI74L_1tal6Sdc0bQiWFNuIMKuQqio1CgHCGb8ExHSvfklhEaTJq6mKjk9JK0h5e_jPg6RRFiO6Fd8HaAUEQMA";

const decoded = jwtDecode(token);

console.log('decoded', decoded, moment(decoded.exp * 1000));

// {
//   accessJwt: 'eyJ0eXAiOiJhdCtqd3QiLCJhbGciOiJFUzI1NksifQ.eyJzY29wZSI6ImNvbS5hdHByb3RvLmFjY2VzcyIsInN1YiI6ImRpZDpwbGM6ZGNnbnA1anlmNWdlb2xnNnFod2ZqcWk2IiwiaWF0IjoxNzM0NDMyOTExLCJleHAiOjE3MzQ0NDAxMTEsImF1ZCI6ImRpZDp3ZWI6c2NhbHljYXAudXMtd2VzdC5ob3N0LmJza3kubmV0d29yayJ9.kI74L_1tal6Sdc0bQiWFNuIMKuQqio1CgHCGb8ExHSvfklhEaTJq6mKjk9JK0h5e_jPg6RRFiO6Fd8HaAUEQMA',
//   refreshJwt: 'eyJ0eXAiOiJyZWZyZXNoK2p3dCIsImFsZyI6IkVTMjU2SyJ9.eyJzY29wZSI6ImNvbS5hdHByb3RvLnJlZnJlc2giLCJzdWIiOiJkaWQ6cGxjOmRjZ25wNWp5ZjVnZW9sZzZxaHdmanFpNiIsImF1ZCI6ImRpZDp3ZWI6YnNreS5zb2NpYWwiLCJqdGkiOiJvN3BXMUU2NjBwR1FsM2lYZXd0V1c2UWJYOXZIdGlqdEFBKzZEdFZDRXNZIiwiaWF0IjoxNzM0NDMyOTExLCJleHAiOjE3NDIyMDg5MTF9.uldYdH7pWMUcdVqHvUg2oNszvpaJpX42c6AZJwuskhdxMQPTjoopu72vzQr0gG6BrMaaU0PfdwGmLVALjL22Ew',
//   handle: 'bskydeck.com',
//   did: 'did:plc:dcgnp5jyf5geolg6qhwfjqi6',
//   email: 'samar@bskydeck.com',
//   emailConfirmed: true,
//   emailAuthFactor: false,
//   active: true,
//   status: undefined
// }

const login = async () => {
  // await agent.login({
  //   identifier: username,
  //   password: password,
  // }).then((res) => {
  //   console.log('res', res);
  // });
  await agent.resumeSession({ accessJwt: token, did: 'did:plc:dcgnp5jyf5geolg6qhwfjqi6' });
  console.log('session', agent.session);
  const val = agent.sessionManager.refreshSession();
  console.log('val', val);
  console.log('session', agent.session);
};

login();


// eyJ0eXAiOiJhdCtqd3QiLCJhbGciOiJFUzI1NksifQ.eyJzY29wZSI6ImNvbS5hdHByb3RvLmFjY2VzcyIsInN1YiI6ImRpZDpwbGM6ZGNnbnA1anlmNWdlb2xnNnFod2ZqcWk2IiwiaWF0IjoxNzM0MzU3NjA4LCJleHAiOjE3MzQzNjQ4MDgsImF1ZCI6ImRpZDp3ZWI6c2NhbHljYXAudXMtd2VzdC5ob3N0LmJza3kubmV0d29yayJ9.UimNGnGNjhrRv_8h1DohsFbraJRVaRut0LBAfgpw7lzIjciVIAafDUb359XDtvN8rxO_xZAvaYMfG5uTOvXedA

// eyJ0eXAiOiJyZWZyZXNoK2p3dCIsImFsZyI6IkVTMjU2SyJ9.eyJzY29wZSI6ImNvbS5hdHByb3RvLnJlZnJlc2giLCJzdWIiOiJkaWQ6cGxjOmRjZ25wNWp5ZjVnZW9sZzZxaHdmanFpNiIsImF1ZCI6ImRpZDp3ZWI6YnNreS5zb2NpYWwiLCJqdGkiOiJMSTJQZWZ3MXBFMURwZFc3SXFKK2RIVGxJRmpQT0Z3d3pEeGQ0aVRJRUFVIiwiaWF0IjoxNzM0MzU3NjA4LCJleHAiOjE3NDIxMzM2MDh9.MShfEFJ6Rp1tyg-EwECJJlj5pGb191TriDWvNdPafIAEi-VBri8y9s8Y2_DWMGAVVrvFKMc7uytCJkmp2M7aew