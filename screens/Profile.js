import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity,Platform ,Dimensions} from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import DateOfBirth from '../components/Profile/DateOfBirth';
import ProfilePic from '../components/Profile/ProfilePic';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import theme from '../config/theme';
import realm from '../db_configs/realm';

const { width } = Dimensions.get('window');
const scale = width / 375; // 375 is the baseline width (iPhone 6)

const scaleFont = (size) => size * scale;
const scaleSize = (size) => size * scale;

const Profile = () => {

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
            marginTop:-20,
            borderWidth:2,
            width:'90%',
            borderRadius:25,
            borderColor: theme.colors.basicColor,
            padding:10,
            height:Platform.OS==='ios'?'51%':'56%',
            paddingTop:30
        }
    });
    useEffect(() => {
        fetchUser ();
    }, []);

    const fetchUser  = async () => {
        const user = realm.objects('User')[0];
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
                    <MaterialIcons name={"edit"} size={24} color={theme.colors.basicColor} />  
             </TouchableOpacity>}
         <View style={[styles.textbox,!isEditing&&styles.iseditTextBox]}> 
            <Text style={styles.icon}><MaterialIcons name='person' size={24} color={theme.colors.basicColor}/> </Text>
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
        <Text style={styles.icon}><MaterialIcons name='person-pin' size={24} color={theme.colors.basicColor}/> </Text>
        <View style={[styles.textcontainer,!isEditing&&styles.isEditingTextContainer]}>                   
            <Text style={isEditing?styles.lable:styles.iseditlable}> Role :</Text>
            <View style={styles.inputContainer}>
                {isEditing? (
                    <TextInput style={[styles.inputField,{fontSize:16}]} value={role} onChangeText={setRole} placeholder="Your Role"/>
                ) : (
                    <Text style={[isEditing?styles.textField:styles.iseditTextField,styles.role]}>{role}</Text>)} 
            </View>
            </View>
        </View>            

        <View style={[styles.textbox,!isEditing&&styles.iseditTextBox]}>  
        <Text style={styles.icon}><MaterialIcons name='cake' size={24} color={theme.colors.basicColor}/> </Text>
        <View style={[styles.textcontainer,!isEditing&&styles.isEditingTextContainer]}>        
            <Text style={isEditing?styles.lable:styles.iseditlable}>D.O.B :</Text>
            <DateOfBirth isEditing={isEditing} setIsEditing={setIsEditing} selectedDate={selectedDate} setSelectedDate={setSelectedDate}/>
            </View>
        </View>


        <View style={[styles.textbox,!isEditing&&styles.iseditTextBox]}>  
        <Text style={styles.icon}><MaterialIcons name='sticky-note-2' size={24} color={theme.colors.basicColor}/> </Text>
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
        borderBottomColor: theme.colors.basicColor,
        flex: 1,
        paddingHorizontal: scaleSize(5),
        paddingBottom:Platform.OS==='android'?scaleSize(0):scaleSize(2),
        textAlign: 'center',
        color:theme.colors.basicColor,
    },
    textbox:{
        flexDirection:'row',
        width:'100%',
    },
    iseditTextBox:{
        marginLeft:30,
        marginBottom:10
    },
    textcontainer:{
        width:'100%',
    },
    isEditingTextContainer:{
        flexDirection:'row'
    },
    textField: {
        textAlign: 'center',
        flex: 1,
        paddingBottom: scaleSize(2),
        color: theme.colors.basicColor,
    },
    iseditTextField:{
        color: theme.colors.basicColor,
        flex: 1,
        marginTop: scaleSize(5),
        paddingBottom: scaleSize(2),
        marginLeft:-20,
       
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
        borderColor: theme.colors.basicColor,
        padding: scaleSize(10),
        borderRadius: scaleSize(10),
        backgroundColor: '#f9f9f9',
        lineHeight: scaleSize(20),
        height: scaleSize(90),
        color:theme.colors.basicColor,
        marginBottom:Platform.OS==='android'?0:60
    },
    footerContainer: {
        position: 'absolute',
        bottom:-220,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingVertical: scaleSize(10),
    },
    line: {
        borderBottomWidth: scaleSize(1),
        borderBottomColor: theme.colors.basicColor,
        width: '80%',
        marginBottom: scaleSize(10),
    },
    footerText: {
        fontSize: scaleFont(14),
        color: theme.colors.basicColor,
        textAlign: 'center',
        marginBottom: scaleSize(10),
    },
    
    lable: {
        alignSelf: 'flex-start',
        fontWeight: 'bold',
        color: theme.colors.basicColor,
        marginTop: scaleSize(5),
        marginLeft:30,
        marginBottom:Platform.OS==='android'?0:7
    },
    iseditlable:{
        fontSize:scaleFont(14),
        fontWeight: 'bold',
        color: theme.colors.basicColor,
        marginTop: scaleSize(5),
        marginLeft:40,
        textAlign:'right'
    },
    btncontainer: {
        flexDirection: 'row',
        height: scaleSize(75), // Scaled height for button container
         marginTop:30
        
    },
    btnsave: {
        textAlign:'center',
        width: scaleSize(80),
        fontSize: scaleFont(16),
        color: '#fff',
        backgroundColor: theme.colors.basicColor,
        width:120,
        borderRadius:5
    },
    btncancel: {
        backgroundColor: '#fff',
        textAlign:'center',
        width: scaleSize(80),
        color: theme.colors.basicColor,
        fontSize: scaleFont(16),
        marginLeft: scaleSize(15),
        borderColor:theme.colors.basicColor,
        borderWidth:1,
        width:120,
        borderRadius:5
    },
    icon:{
        marginRight:-20
    },
    form:{
        borderWidth:2,
        width:'90%',
        borderRadius:25,
        borderColor:theme.colors.basicColor,
        padding:10
    },
    bio:{
        marginLeft:-40
    },
    role:{
        marginLeft:-5
    },
    names:{
        width:225,
        flexDirection:'row',
    },
    namesinput:{
        marginRight:10
    }
    
});

