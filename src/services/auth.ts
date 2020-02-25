import firebase from 'firebase';

export class AuthService{

    signin(email: string, password: string){
        return firebase.auth().signInWithEmailAndPassword(email, password);
    }

    logout(){
        firebase.auth().signOut();
    }

    getActiveUser(){
        return firebase.auth().currentUser;
    }
}