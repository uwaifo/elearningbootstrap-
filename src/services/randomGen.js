import randomstring from 'randomstring';

export function rsGen(){
    let genCode = randomstring.generate(8);
    //console.log(genCode);

    return genCode;
}