import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity,Platform ,Dimensions} from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { useSQLiteContext } from 'expo-sqlite';
import DateOfBirth from '../components/Profile/DateOfBirth';
import { Button } from 'react-native-elements';
import ProfilePic from '../components/Profile/ProfilePic';

const { width } = Dimensions.get('window');
const scale = width / 375; // 375 is the baseline width (iPhone 6)

const scaleFont = (size) => size * scale;
const scaleSize = (size) => size * scale;

const Profile = () => {
    const db = useSQLiteContext();

    const[isEditing,setIsEditing]=useState(false);
    const [name, setName] = useState();
    const [companyName, setCompanyName] = useState("");
    const [bio, setBio] = useState("This is your bio !");
    const [role,setRole]=useState('')
    const [email, setEmail] = useState("");
    const [profilePic, setProfilePic] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date(2002, 4, 1));

    const staticstyles=StyleSheet.create({
        isEditingForm:{
            marginTop:-20,
            borderWidth:2,
            width:'90%',
            borderRadius:25,
            borderColor: '#6200EE',
            padding:10,
            height:Platform.OS==='ios'?'60%':'65%',
            paddingTop:30
        }
    });
    useEffect(() => {
        fetchUser ();
    }, []);

    const fetchUser  = async () => {
        const user = await db.getFirstAsync('SELECT * FROM user');
        setName(user.name);
        setProfilePic(user.profilePicture);
        setEmail(user.email);
        setRole('Junior Developer');
        setCompanyName('Company Name')
    }

    

    const handleEdit = () => setIsEditing(true);
    const handleSave = () => {
        if (bio.length > 150) {
            alert("Bio cannot exceed 150 characters.");
        } else {
            setIsEditing(false);
        }
    };

    return (
        <View style={styles.container}>
            <ProfilePic profilePic={profilePic} isEditing={isEditing} email={email} companyName={companyName} setProfilePic={setProfilePic}/>
        <View style={isEditing?staticstyles.isEditingForm:styles.form}>
           {!isEditing&& <TouchableOpacity onPress={handleEdit} style={styles.editIcon}>
                    <MaterialIcons name={"edit"} size={24} color="#6200EE" />  
             </TouchableOpacity>}
         <View style={[styles.textbox,!isEditing&&styles.iseditTextBox]}> 
            {!isEditing&&<Text style={styles.icon}><MaterialIcons name='person' size={34} color="#6200EE"/> </Text>}
            <View style={styles.textcontainer}>
            <Text style={isEditing?styles.lable:styles.iseditlable}>  Name :</Text>
                <View style={styles.inputContainer}>
                    {isEditing? (
                        <TextInput
                            style={styles.inputField} value={name} onChangeText={setName} placeholder="Your Name"/>
                        ) : (
                        <Text style={[isEditing?styles.textField:styles.iseditTextField]}>{name}</Text> )}
                </View>
            </View>
        </View>  
        <View style={[styles.textbox,!isEditing&&styles.iseditTextBox]}>  
        {!isEditing&&<Text style={styles.icon}><MaterialIcons name='person-pin' size={34} color="#6200EE"/> </Text>}
        <View style={styles.textcontainer}>                   
            <Text style={isEditing?styles.lable:styles.iseditlable}> Role :</Text>
            <View style={styles.inputContainer}>
                {isEditing? (
                    <TextInput style={[styles.inputField,{fontSize:16}]} value={role} onChangeText={setRole} placeholder="Your Name"/>
                ) : (
                    <Text style={[isEditing?styles.textField:styles.iseditTextField,styles.role]}>{role}</Text>)} 
            </View>
            </View>
        </View>            

        <View style={[styles.textbox,!isEditing&&styles.iseditTextBox]}>  
        {!isEditing&&<Text style={styles.icon}><MaterialIcons name='cake' size={34} color="#6200EE"/> </Text>}
        <View style={styles.textcontainer}>        
            <Text style={isEditing?styles.lable:styles.iseditlable}>Date Of Birth :</Text>
            <DateOfBirth isEditing={isEditing} setIsEditing={setIsEditing} selectedDate={selectedDate} setSelectedDate={setSelectedDate}/>
            </View>
        </View>


        <View style={[styles.textbox,!isEditing&&styles.iseditTextBox]}>  
        {!isEditing&&<Text style={styles.icon}><MaterialIcons name='sticky-note-2' size={34} color="#6200EE"/> </Text>}
        <View style={styles.textcontainer}>
            <Text style={[isEditing?styles.lable:styles.iseditlable]}>Bio :</Text>
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                <View style={styles.inputContainer}>
                    {isEditing ? (
                        <TextInput style={styles.textArea} value={bio} onChangeText={setBio} placeholder="Your bio" multiline numberOfLines={4} />
                    ) : (
                        <Text style={[isEditing?styles.textField:styles.iseditTextField,styles.bio]}>{bio}</Text>)}
                </View>
            </ScrollView>
            </View>
            </View>
            
            {isEditing && (
                    <View style={styles.btncontainer}>
                        <Button onPress={handleSave} buttonStyle={styles.btnsave}  title="Save" />
                        <Button  onPress={() => setIsEditing(false)}  buttonStyle={styles.btncancel} title="Cancel" />
                    </View>)}
    </View>
            {/* Footer */}
            <View style={styles.footerContainer}>
                <View style={styles.line}></View>
                <Text style={styles.footerText}>Powered by Sprexcel</Text>
            </View>
        </View>
    );
};

export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: scaleSize(20), // Scaled padding for consistency
        backgroundColor: '#f4f7fa',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: scaleSize(20), // Scaled margin
        width: '70%',
        marginLeft:50
    },
    inputField: {
        width:200,
        fontSize: scaleFont(18), // Scaled font size
        borderBottomWidth: scaleSize(2),
        borderBottomColor: '#6200EE',
        flex: 1,
        marginRight: scaleSize(10),
        paddingHorizontal: scaleSize(10),
        paddingVertical: scaleSize(5),
        textAlign: 'center',
    },
    textbox:{
        flexDirection:'row',
        width:'100%',
        alignItems: 'center',
    },
    iseditTextBox:{
        marginLeft:30,
        marginBottom:10
    },
    textcontainer:{
        width:'100%',
    },
    textField: {
        textAlign: 'center',
        flex: 1,
        marginTop: scaleSize(10),
        paddingBottom: scaleSize(2),
    },
    iseditTextField:{
        textAlign: 'left',
        flex: 1,
        marginTop: scaleSize(5),
        paddingBottom: scaleSize(2),
    },
    editIcon: {
        padding: scaleSize(5),
        alignSelf: 'flex-end',
        marginRight: scaleSize(20),
        marginTop: scaleSize(10),
        flexDirection: 'row',
    },
    
    scrollViewContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    textArea: {
        fontSize: scaleFont(14),
        color: '#333',
        marginTop: scaleSize(10),
        textAlign: 'center',
        flex: 1,
        borderWidth: scaleSize(1),
        borderColor: '#6200EE',
        padding: scaleSize(10),
        borderRadius: scaleSize(10),
        backgroundColor: '#f9f9f9',
        lineHeight: scaleSize(20),
        height: scaleSize(90),
    },
    footerContainer: {
        position: 'absolute',
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingVertical: scaleSize(10),
    },
    line: {
        borderBottomWidth: scaleSize(1),
        borderBottomColor: '#6200EE',
        width: '80%',
        marginBottom: scaleSize(10),
    },
    footerText: {
        fontSize: scaleFont(14),
        color: '#6200EE',
        textAlign: 'center',
        marginBottom: scaleSize(10),
    },
    
    lable: {
        alignSelf: 'flex-start',
        fontWeight: 'bold',
        color: '#6200EE',
        marginTop: scaleSize(5),
        marginLeft:30
    },
    iseditlable:{
        fontSize:scaleFont(14),
        fontWeight: 'bold',
        color: '#6200EE',
        marginTop: scaleSize(5),
        marginLeft:40
    },
    btncontainer: {
        flexDirection: 'row',
        height: scaleSize(100), // Scaled height for button container
        marginLeft:90
    },
    btnsave: {
        width: scaleSize(80),
        fontSize: scaleFont(16),
        color: '#fff',
        backgroundColor: '#6200EE',
    },
    btncancel: {
        backgroundColor: '#B0BEC5',
        width: scaleSize(80),
        color: '#fff',
        fontSize: scaleFont(16),
        marginLeft: scaleSize(15),
    },
    icon:{
        marginRight:-30
    },
    form:{
        borderWidth:2,
        width:'90%',
        borderRadius:25,
        borderColor: '#6200EE',
        padding:10
    },
    bio:{
        marginLeft:-30
    },
    role:{
        marginLeft:-5
    }
    
});

// ,!isEditing&&styles.textboxisedit]