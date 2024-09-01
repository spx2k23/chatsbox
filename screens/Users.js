import { FlatList } from "react-native";
import { View } from "react-native";
import { Text } from "react-native";
import ChatBox from "../components/ChatBox/ChatBox";

const Users=()=>{

    const data =[{
        image:'https://scontent.fmaa15-1.fna.fbcdn.net/v/t39.30808-1/306163119_395338919425615_8855944441524828272_n.jpg?stp=dst-jpg_s200x200&_nc_cat=104&ccb=1-7&_nc_sid=f4b9fd&_nc_ohc=LMQL7y0yFOsQ7kNvgGyQMbS&_nc_ht=scontent.fmaa15-1.fna&oh=00_AYDO38sfis-pjVglKwWjMXzkaTzp_7Y5JkBybHEFn_E6dw&oe=66DA602D',
        name:'Witcher',
        email:'witcher@gmail.com',
    },
    {
        image:'https://cdn.pixabay.com/photo/2023/01/06/12/38/ai-generated-7701143_640.jpg',
        name:'drago',
        email:'drago@gmail.com'
    }
]
    return(
        <View>
        <FlatList 
        data={data}
        keyExtractor={(data)=>data.email}
        renderItem={({ item }) => (
            <ChatBox 
              name={item.name} 
              email={item.email} 
              image={item.image} 
              userId={item.email} 
            />)}
        />
        </View>
    );
}

export default Users;