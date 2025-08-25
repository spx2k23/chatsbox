import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity,Platform ,Dimensions} from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { useSQLiteContext } from 'expo-sqlite';
import DateOfBirth from '../components/Profile/DateOfBirth';
import ProfilePic from '../components/Profile/ProfilePic';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import theme from '../config/theme';
import {vs,s,ms} from 'react-native-size-matters';

const { width } = Dimensions.get('window');
const scale = width / 375; // 375 is the baseline width (iPhone 6)



const Profile = () => {
    
    const db = useSQLiteContext();

    const[isEditing,setIsEditing]=useState(false);
    const [firstname, setFirstName] = useState();
    const [lastname, setLastName] = useState();
    const [companyName, setCompanyName] = useState("");
    const [bio, setBio] = useState("");
    const [role,setRole]=useState("");
    const [email, setEmail] = useState("");
    const [profilePic, setProfilePic] = useState(null);
    const [selectedDate, setSelectedDate] = useState();

    const staticstyles=StyleSheet.create({
        isEditingForm:{
            marginTop:vs(-20),
            borderWidth:2,
            width:'90%',
            borderRadius:ms(25),
            borderColor: theme.colors.basicColor,
            padding:10,
            height:Platform.OS==='ios'?'51%':'56%',
            paddingTop:vs(30)
        }
    });
    useEffect(() => {
        fetchUser ();
    }, []);

    const fetchUser  = async () => {
        const user = await db.getFirstAsync('SELECT * FROM user');
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setProfilePic(user.profilePicture);
        setEmail(user.email);
        setRole(user.role);
        setBio(user.bio);
        setSelectedDate(user.dateOfBirth);
        setCompanyName('Company Name');
        // console.log(user.dateOfBirth);
        
    }

    

    const handleEdit = () => setIsEditing(true);
    const handleSave = () => {
        if (bio.length > 32) {
            alert("Bio cannot exceed 32 characters.");
        } else {
            setIsEditing(false);
        }
    };

    return (
        <KeyboardAwareScrollView>
        <View style={styles.container}>
            <ProfilePic profilePic={profilePic} isEditing={isEditing} email={email} companyName={companyName} setProfilePic={setProfilePic}/>
        <View style={isEditing?staticstyles.isEditingForm:styles.form}>
           {!isEditing&& <TouchableOpacity onPress={handleEdit} style={styles.editIcon}>
                    <MaterialIcons name={"edit"} size={ms(24)} color={theme.colors.basicColor} />  
             </TouchableOpacity>}
         <View style={[styles.textbox,!isEditing&&styles.iseditTextBox]}> 
            <Text style={styles.icon}><MaterialIcons name='person' size={ms(24)} color={theme.colors.basicColor}/> </Text>
            <View style={[styles.textcontainer,!isEditing&&styles.isEditingTextContainer]}>
            <Text style={isEditing?styles.lable:styles.iseditlable}>  Name :</Text>
                <View style={styles.inputContainer}>
                    {isEditing? (
                        <View style={styles.names}>
                        <TextInput style={[styles.inputField,styles.namesinput]} value={firstname} onChangeText={setFirstName} placeholder="First Name"/>
                        <TextInput style={[styles.inputField,styles.namesinput]} value={lastname} onChangeText={setLastName} placeholder="Last Name"/>
                        </View>
                        ) : (
                        <Text style={[isEditing?styles.textField:styles.iseditTextField]}>{firstname} {lastname}</Text> )}
                </View>
            </View>
        </View>  
        <View style={[styles.textbox,!isEditing&&styles.iseditTextBox]}>  
        <Text style={styles.icon}><MaterialIcons name='person-pin' size={ms(24)} color={theme.colors.basicColor}/> </Text>
        <View style={[styles.textcontainer,!isEditing&&styles.isEditingTextContainer]}>                   
            <Text style={isEditing?styles.lable:styles.iseditlable}> Role :</Text>
            <View style={styles.inputContainer}>
                {isEditing? (
                    <TextInput style={[styles.inputField,{fontSize:ms(16)}]} value={role} onChangeText={setRole} placeholder="Your Role"/>
                ) : (
                    <Text style={[isEditing?styles.textField:styles.iseditTextField,styles.role]}>{role}</Text>)} 
            </View>
            </View>
        </View>            

        <View style={[styles.textbox,!isEditing&&styles.iseditTextBox]}>  
        <Text style={styles.icon}><MaterialIcons name='cake' size={ms(24)} color={theme.colors.basicColor}/> </Text>
        <View style={[styles.textcontainer,!isEditing&&styles.isEditingTextContainer]}>        
            <Text style={isEditing?styles.lable:styles.iseditlable}>D.O.B :</Text>
            <DateOfBirth isEditing={isEditing} setIsEditing={setIsEditing} selectedDate={selectedDate} setSelectedDate={setSelectedDate}/>
            </View>
        </View>


        <View style={[styles.textbox,!isEditing&&styles.iseditTextBox]}>  
        <Text style={styles.icon}><MaterialIcons name='sticky-note-2' size={ms(24)} color={theme.colors.basicColor}/> </Text>
        <View style={[styles.textcontainer,!isEditing&&styles.isEditingTextContainer]}>
            <Text style={[isEditing?styles.lable:styles.iseditlable]}>Bio :</Text>
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                <View style={styles.inputContainer}>
                    {isEditing ? (
                        <TextInput style={styles.textArea} value={bio} onChangeText={setBio} placeholder="Your bio" multiline numberOfLines={4} />
                    ) : (
                        <Text style={[isEditing?styles.textField:styles.iseditTextField,styles.bio]}>{bio === null ? "You have not set bio" : bio}</Text>)}
                </View>
            </ScrollView>
            </View>
            </View>
    </View>
    {isEditing && (
                    <View style={styles.btncontainer}>
                        <TouchableOpacity onPress={handleSave}  ><Text style={styles.btnsave}>Save</Text></TouchableOpacity>
                        <TouchableOpacity onPress={() => setIsEditing(false)} ><Text  style={styles.btncancel}>Cancel</Text></TouchableOpacity>
                    </View>)}
            {/* Footer */}
            <View style={styles.footerContainer}>
                <View style={styles.line}></View>
                <Text style={styles.footerText}>Powered by Sprexcel</Text>
            </View>
        </View>
        </KeyboardAwareScrollView>
    );
};

export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: ms(20), // Scaled padding for consistency
        backgroundColor: '#f4f7fa',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: vs(20), // Scaled margin
        width: '70%',
        marginLeft:s(50)
    },
    inputField: {
        width:s(200),
        fontSize: ms(18), // Scaled font size
        borderBottomWidth: s(2),
        borderBottomColor: theme.colors.basicColor,
        flex: 1,
        paddingHorizontal: vs(5),
        paddingBottom:Platform.OS==='android'?(0):vs(2),
        textAlign: 'center',
        color:theme.colors.basicColor,
    },
    textbox:{
        flexDirection:'row',
        width:'100%',
    },
    iseditTextBox:{
        marginLeft:s(30),
        marginBottom:vs(10)
    },
    textcontainer:{
        width:'100%',
    },
    isEditingTextContainer:{
        flexDirection:'row',
        fontSize:ms(14)
    },
    textField: {
        textAlign: 'center',
        flex: 1,
        paddingBottom: vs(2),
        color: theme.colors.basicColor,
        fontSize:ms(14)
    },
    iseditTextField:{
        color: theme.colors.basicColor,
        flex: 1,
        marginTop: vs(5),
        paddingBottom: vs(2),
        marginLeft:s(-20),
        fontSize:ms(12)
    },
    editIcon: {
        padding: ms(5),
        alignSelf: 'flex-end',
        marginRight: s(20),
        marginTop: vs(10),
        flexDirection: 'row',
    },
    
    scrollViewContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    textArea: {
        fontSize: ms(14),
        color: '#333',
        marginTop: vs(10),
        textAlign: 'center',
        flex: 1,
        borderWidth: 1,
        borderColor: theme.colors.basicColor,
        padding: ms(10),
        borderRadius: ms(10),
        backgroundColor: '#f9f9f9',
        lineHeight: vs(20),
        height: vs(90),
        color:theme.colors.basicColor,
        marginBottom:Platform.OS==='android'?0:vs(60)
    },
    footerContainer: {
        position: 'absolute',
        bottom:-220,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingVertical:vs(10),
    },
    line: {
        borderBottomWidth: (1),
        borderBottomColor: theme.colors.basicColor,
        width: '80%',
        marginBottom: vs(10),
    },
    footerText: {
        fontSize: ms(14),
        color: theme.colors.basicColor,
        textAlign: 'center',
        marginBottom: vs(10),
    },
    
    lable: {
        alignSelf: 'flex-start',
        fontWeight: 'bold',
        color: theme.colors.basicColor,
        marginTop: vs(5),
        marginLeft:s(30),
        marginBottom:Platform.OS==='android'?0:vs(7),
        fontSize:ms(12)
    },
    iseditlable:{
        fontSize:ms(14),
        fontWeight: 'bold',
        color: theme.colors.basicColor,
        marginTop: vs(5),
        marginLeft:s(40),
        textAlign:'right'
    },
    btncontainer: {
        flexDirection: 'row',
        height: vs(75), // Scaled height for button container
         marginTop:vs(30)
        
    },
    btnsave: {
        textAlign:'center',
        width: s(80),
        fontSize: ms(16),
        color: '#fff',
        backgroundColor: theme.colors.basicColor,
        width:s(120),
        borderRadius:ms(5)
    },
    btncancel: {
        backgroundColor: '#fff',
        textAlign:'center',
        width: s(80),
        color: theme.colors.basicColor,
        fontSize: ms(16),
        marginLeft: s(15),
        borderColor:theme.colors.basicColor,
        borderWidth:1,
        width:s(120),
        borderRadius:ms(5)
    },
    icon:{
        marginRight:s(-20)
    },
    form:{
        borderWidth:2,
        width:'90%',
        borderRadius:ms(25),
        borderColor:theme.colors.basicColor,
        padding:ms(10)
    },
    bio:{
        marginLeft:s(-40),

    },
    role:{
        marginLeft:-5
    },
    names:{
        width:s(225),
        flexDirection:'row',
        
    },
    namesinput:{
        marginRight:s(10)
    }
    
});

