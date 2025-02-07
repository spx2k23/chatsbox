import { View,Text } from "react-native"
import VoteOption from "./VoteOption";

const Vote=({item})=>{
    const optionDatas=[...item.option];
    const totalVotes = optionDatas.reduce((acc, curr) => acc + curr.votes, 0);
    console.log(totalVotes);
    
    return(
    <View>
        <Text>{item.topic}</Text>
        {
            optionDatas.map((opt,index)=>{
                return <VoteOption data={opt} totalVotes={totalVotes}/>
            })
        }
    </View>
    );
}

export default Vote;