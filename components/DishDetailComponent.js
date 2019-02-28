import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, Modal, StyleSheet } from 'react-native';
import { Card, Icon, Rating, Input, Button } from 'react-native-elements';
import { DISHES } from '../shared/dishes';
import { COMMENTS } from '../shared/comments';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite } from '../redux/ActionCreators';


const mapStateToProps = state => {
    return {
      dishes: state.dishes,
      comments: state.comments,
      favorites: state.favorites
    }
  }

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId))
})

function RenderDish(props) {
    const dish = props.dish;
    if (dish != null) {
        return(
            <Card
                featuredTitle={dish.name}
                image={{uri: baseUrl + dish.image}}>
                <Text style={{margin: 10}}>
                    {dish.description}
                </Text>
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                    <Icon 
                        // raised = rounded button display
                        raised
                        //opposite color surrounding
                        reverse
                        name={ props.favorite ? 'heart' : 'heart-o'}
                        type='font-awesome'
                        color='#f50'
                        onPress={() => props.favorite ? console.log('Already favorite') : props.markFavorite()}
                    />
                    <Icon 
                        // raised = rounded button display
                        raised
                        //opposite color surrounding
                        reverse
                        name='pencil'
                        type='font-awesome'
                        color='#512DA8'
                        onPress={() => props.toggleModal()}
                    />
                </View>
            </Card>
        );
    }
    else {
        return(<View></View>);
    }
}

function RenderComments(props) {
    const comments = props.comments;
            
    const renderCommentItem = ({item, index}) => {
        return (
            <View key={index} style={{margin: 10}}>
                <Text style={{fontSize: 14}}>{item.comment}</Text>
                <Text style={{fontSize: 12}}>{item.rating} Stars</Text>
                <Text style={{fontSize: 12}}>{'-- ' + item.author + ', ' + item.date} </Text>
            </View>
        );
    };
    
    return (
        <Card title='Comments' >
        <FlatList 
            data={comments}
            renderItem={renderCommentItem}
            keyExtractor={item => item.id.toString()}
            />
        </Card>
    );
}

class DishDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dishes: DISHES,
            comments: COMMENTS,
            favorites: [],
            showModal: false
        };
    }

    static navigationOptions = {
        title: 'Dish Details'
    };

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
        console.log('markFavorite activated!')
    }

    toggleModal() {
        this.setState({showModal: !this.state.showModal})
    }

    render() {
        const dishId = this.props.navigation.getParam('dishId','');
        return(
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    markFavorite={() => {this.markFavorite(dishId)}}
                    toggleModal={()=> {this.toggleModal()}}
                    />
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
                
                <Modal animationType = {"slide"} transparent = {false}
                    visible = {this.state.showModal}>
                    <View style={styles.formRow}>
                        <Rating showRating fractions={1} startingValue={3.0} />
                    </View>
                    <View style={styles.formRow}>
                        <Input
                            placeholder=' Author'
                            leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                        />
                    </View>
                    <View style={styles.formRow}>
                        <Input
                            placeholder=' Comment'
                            leftIcon={{ type: 'font-awesome', name: 'comment-o' }}
                        />
                    </View>
                    <View style={styles.button}>
                        {/* Submit Button */}
                        <Button
                            //onPress={() => {this.postComment(); this.toggleModal(); this.resetForm();}}
                            raised
                            title="Submit"
                            //backgroundColor="#512DA8"
                        />
                        {/* Cancel Button */}
                        <Button
                            //closes modal and resets the form
                            //onPress = {() =>{this.toggleModal(); this.resetForm();}}
                            raised
                            title="Cancel"
                            //backgroundColor="#D3D3D3" 
                        />
                    </View>
                </Modal>
            </ScrollView>


        );
    }
}

const styles = StyleSheet.create({
    formRow: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      flexDirection: 'row',
      margin: 20
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem: {
        flex: 1
    },
    modal: {
        justifyContent: 'center',
        margin: 20
     },
     modalTitle: {
         fontSize: 24,
         fontWeight: 'bold',
         backgroundColor: '#512DA8',
         textAlign: 'center',
         color: 'white',
         marginBottom: 20
     },
     modalText: {
         fontSize: 18,
         margin: 10
     },
     button: {
         flex: 1,
         flexDirection: 'column'
     }
});

export default connect(mapStateToProps, mapDispatchToProps)(DishDetail);
