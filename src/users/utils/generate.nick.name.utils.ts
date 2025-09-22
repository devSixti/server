
export const generateNickname =  (name: string, lastName: string) => {

    let nickname = `${name.toLowerCase()}${lastName.toLowerCase()}${Math.floor(Math.random() * 900000) + 100000}`;


    return nickname;
}