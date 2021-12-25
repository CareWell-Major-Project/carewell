import React, {useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  Image,
  View,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  ScrollView,
  SafeAreaView,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native';

import backIcon from '../assets/back-black.png';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
import colors from '../components/colors';
import firestore from '@react-native-firebase/firestore';
import links from '../components/links';
import LinearGradient from 'react-native-linear-gradient';
import {set} from 'react-native-reanimated';

export default function AllPackages({navigation, route}) {
  // const {packages} = route.params;
  const [packages, setpackages] = useState([]);
  const [lastclinic, setlastclinic] = useState(null);
  const [enddocid, setenddocid] = useState(null);
  const [lastDocs, setlastDocs] = useState(new Map());

  useEffect(() => {
    setcompletelabs();
  }, []);

  async function addtocart(source) {
    console.log('source ', source);
    console.log('source', source.fees);
    // console.log(JSON.stringify(source, null, 2))
    navigation.navigate('BooklabCalender', {source});
  }

  async function setcompletelabs() {
    // setpackages([]);
    await firestore()
      .collection('clinics')
      .get()
      .then(querySnapshot => {
        // console.log(querySnapshot.size);
        setenddocid(querySnapshot.docs[querySnapshot.size - 1].id);
      });

    let t = 1;
    const lab = await firestore()
      .collection('clinics')
      .orderBy(firestore.FieldPath.documentId())
      .limit(2)
      .get()
      .then(querySnapshot => {
        const temp = [];
        console.log('first', querySnapshot.size);
        querySnapshot.forEach(async documentSnapshot1 => {
          // console.log(documentSnapshot1.id);
          if (lastDocs.has(documentSnapshot1.id)) {
            await firestore()
              .collection('clinics')
              .doc(documentSnapshot1.id)
              .collection('labtests')
              .orderBy(firestore.FieldPath.documentId())
              .startAfter(lastDocs.get(documentSnapshot1.id))
              .limit(5)
              .get()
              .then(querySnapshot => {
                querySnapshot.forEach(documentSnapshot2 => {
                  console.log(t++);
                  temp.push({
                    test_name: documentSnapshot2.data().package_name,
                    lab_name: documentSnapshot2.data().lab_name,
                    clinic_name: documentSnapshot1.data().name,
                    fees: documentSnapshot2.data().fees,
                    clinic: {
                      facility: documentSnapshot1.data().facility,
                      id: documentSnapshot1.data().id,
                      image: documentSnapshot1.data().image,
                      location: documentSnapshot1.data().location,
                      name: documentSnapshot1.data().name,
                      rating: documentSnapshot1.data().rating,
                      time: documentSnapshot1.data().time,
                    },
                    type: 'labtest',
                    lab_id: documentSnapshot2.data().max_lab_id,
                    date: new Date(),
                    lon: documentSnapshot1.data().location.long,
                    lat: documentSnapshot1.data().location.lat,
                  });
                  setlastDocs(
                    lastDocs.set(documentSnapshot1.id, documentSnapshot2.id),
                  );
                });
              });
          } else {
            await firestore()
              .collection('clinics')
              .doc(documentSnapshot1.id)
              .collection('labtests')
              .orderBy(firestore.FieldPath.documentId())
              .limit(5)
              .get()
              .then(querySnapshot => {
                querySnapshot.forEach(documentSnapshot2 => {
                  console.log(t++);
                  temp.push({
                    test_name: documentSnapshot2.data().package_name,
                    lab_name: documentSnapshot2.data().lab_name,
                    Requirements: documentSnapshot2.data().Requirements,
                    Note: documentSnapshot2.data().Note,
                    Process: documentSnapshot2.data().Process,
                    tests_included: documentSnapshot2.data().tests_included,
                    sample_collection_facility: documentSnapshot2.data()
                      .sample_collection_facility,
                    clinic_name: documentSnapshot1.data().name,
                    fees: documentSnapshot2.data().fees,
                    clinic: {
                      facility: documentSnapshot1.data().facility,
                      id: documentSnapshot1.data().id,
                      image: documentSnapshot1.data().image,
                      location: documentSnapshot1.data().location,
                      name: documentSnapshot1.data().name,
                      rating: documentSnapshot1.data().rating,
                      time: documentSnapshot1.data().time,
                    },
                    type: 'labtest',
                    lab_id: documentSnapshot2.data().max_lab_id,
                    date: new Date(),
                    lon: documentSnapshot1.data().location.long,
                    lat: documentSnapshot1.data().location.lat,
                  });
                  setlastDocs(
                    lastDocs.set(documentSnapshot1.id, documentSnapshot2.id),
                  );
                });
              });
          }

          setlastclinic(documentSnapshot1.id);
        });
        // setpackages(...packages, temp);
        setpackages(temp);
      });
    console.log('packages ', packages);
  }

  async function retrieveMore() {
    // setpackages([]);
    console.log(lastclinic);
    let t = 1;
    if (lastclinic == enddocid) {
      console.log('in enddoc');
      const lab = await firestore()
        .collection('clinics')
        .orderBy(firestore.FieldPath.documentId())
        .limit(2)
        .get()
        .then(querySnapshot => {
          // const temp = [];
          console.log(querySnapshot.size);
          querySnapshot.forEach(async documentSnapshot1 => {
            console.log('i am here');
            if (lastDocs.has(documentSnapshot1.id)) {
              await firestore()
                .collection('clinics')
                .doc(documentSnapshot1.id)
                .collection('labtests')
                .orderBy(firestore.FieldPath.documentId())
                .startAfter(lastDocs.get(documentSnapshot1.id))
                .limit(5)
                .get()
                .then(querySnapshot => {
                  querySnapshot.forEach(documentSnapshot2 => {
                    console.log(2, t++);
                    console.log(documentSnapshot2.id);

                    setpackages(prevstate => [
                      ...prevstate,
                      {
                        test_name: documentSnapshot2.data().package_name,
                        lab_name: documentSnapshot2.data().lab_name,
                        Requirements: documentSnapshot2.data().Requirements,
                        Note: documentSnapshot2.data().Note,
                        Process: documentSnapshot2.data().Process,
                        tests_included: documentSnapshot2.data().tests_included,
                        sample_collection_facility: documentSnapshot2.data()
                          .sample_collection_facility,
                        clinic_name: documentSnapshot1.data().name,
                        fees: documentSnapshot2.data().fees,
                        clinic: {
                          facility: documentSnapshot1.data().facility,
                          id: documentSnapshot1.data().id,
                          image: documentSnapshot1.data().image,
                          location: documentSnapshot1.data().location,
                          name: documentSnapshot1.data().name,
                          rating: documentSnapshot1.data().rating,
                          time: documentSnapshot1.data().time,
                        },
                        type: 'labtest',
                        lab_id: documentSnapshot2.data().max_lab_id,
                        date: new Date(),
                        lon: documentSnapshot1.data().location.long,
                        lat: documentSnapshot1.data().location.lat,
                      },
                    ]);
                    setlastDocs(
                      lastDocs.set(documentSnapshot1.id, documentSnapshot2.id),
                    );
                  });
                });
            } else {
              await firestore()
                .collection('clinics')
                .doc(documentSnapshot1.id)
                .collection('labtests')
                .orderBy(firestore.FieldPath.documentId())
                .limit(5)
                .get()
                .then(querySnapshot => {
                  querySnapshot.forEach(documentSnapshot2 => {
                    console.log(2, t++);
                    console.log(documentSnapshot2.id);
                    setpackages(prevstate => [
                      ...prevstate,
                      {
                        test_name: documentSnapshot2.data().package_name,
                        lab_name: documentSnapshot2.data().lab_name,
                        clinic_name: documentSnapshot1.data().name,
                        fees: documentSnapshot2.data().fees,
                        clinic: {
                          facility: documentSnapshot1.data().facility,
                          id: documentSnapshot1.data().id,
                          image: documentSnapshot1.data().image,
                          location: documentSnapshot1.data().location,
                          name: documentSnapshot1.data().name,
                          rating: documentSnapshot1.data().rating,
                          time: documentSnapshot1.data().time,
                        },
                        type: 'labtest',
                        lab_id: documentSnapshot2.data().max_lab_id,
                        date: new Date(),
                        lon: documentSnapshot1.data().location.long,
                        lat: documentSnapshot1.data().location.lat,
                      },
                    ]);
                    setlastDocs(
                      lastDocs.set(documentSnapshot1.id, documentSnapshot2.id),
                    );
                  });
                });
            }

            setlastclinic(documentSnapshot1.id);
          });
          // let k = ...packages, temp;
          // setpackages(oldArray => [...oldArray, temp]);
          // setpackages(temp);
        });
    } else {
      console.log('not in enddoc');

      const lab = await firestore()
        .collection('clinics')
        .orderBy(firestore.FieldPath.documentId())
        .startAfter(lastclinic)
        .limit(2)
        .get()
        .then(querySnapshot => {
          // const temp = [];
          console.log(querySnapshot.size);
          querySnapshot.forEach(async documentSnapshot1 => {
            console.log('i am here');
            if (lastDocs.has(documentSnapshot1.id)) {
              await firestore()
                .collection('clinics')
                .doc(documentSnapshot1.id)
                .collection('labtests')
                .orderBy(firestore.FieldPath.documentId())
                .startAfter(lastDocs.get(documentSnapshot1.id))
                .limit(5)
                .get()
                .then(querySnapshot => {
                  querySnapshot.forEach(documentSnapshot2 => {
                    console.log(2, t++);
                    setpackages(prevstate => [
                      ...prevstate,
                      {
                        test_name: documentSnapshot2.data().package_name,
                        lab_name: documentSnapshot2.data().lab_name,
                        clinic_name: documentSnapshot1.data().name,
                        fees: documentSnapshot2.data().fees,
                        clinic: {
                          facility: documentSnapshot1.data().facility,
                          id: documentSnapshot1.data().id,
                          image: documentSnapshot1.data().image,
                          location: documentSnapshot1.data().location,
                          name: documentSnapshot1.data().name,
                          rating: documentSnapshot1.data().rating,
                          time: documentSnapshot1.data().time,
                        },
                        type: 'labtest',
                        lab_id: documentSnapshot2.data().max_lab_id,
                        date: new Date(),
                        lon: documentSnapshot1.data().location.long,
                        lat: documentSnapshot1.data().location.lat,
                      },
                    ]);
                  });
                });
            } else {
              await firestore()
                .collection('clinics')
                .doc(documentSnapshot1.id)
                .collection('labtests')
                .orderBy(firestore.FieldPath.documentId())
                .limit(5)
                .get()
                .then(querySnapshot => {
                  querySnapshot.forEach(documentSnapshot2 => {
                    console.log(2, t++);
                    setpackages(prevstate => [
                      ...prevstate,
                      {
                        test_name: documentSnapshot2.data().package_name,
                        lab_name: documentSnapshot2.data().lab_name,
                        clinic_name: documentSnapshot1.data().name,
                        fees: documentSnapshot2.data().fees,
                        clinic: {
                          facility: documentSnapshot1.data().facility,
                          id: documentSnapshot1.data().id,
                          image: documentSnapshot1.data().image,
                          location: documentSnapshot1.data().location,
                          name: documentSnapshot1.data().name,
                          rating: documentSnapshot1.data().rating,
                          time: documentSnapshot1.data().time,
                        },
                        type: 'labtest',
                        lab_id: documentSnapshot2.data().max_lab_id,
                        date: new Date(),
                        lon: documentSnapshot1.data().location.long,
                        lat: documentSnapshot1.data().location.lat,
                      },
                    ]);
                  });
                });
            }

            setlastclinic(documentSnapshot1.id);
          });
          // let k = ...packages, temp;
          // setpackages(oldArray => [...oldArray, temp]);
          // setpackages(temp);
        });
    }
    // console.log('packages ', packages);
  }

  const renderFooter = () => {
    return (
      //Footer View with Loader
      <View style={styles.footer}>
        {loading ? (
          <ActivityIndicator color="black" style={{margin: 15}} />
        ) : null}
      </View>
    );
  };

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView
        onScroll={({nativeEvent}) => {
          if (isCloseToBottom(nativeEvent)) {
            if (packages.length > 0) {
              retrieveMore();
            }
          }
        }}
        scrollEventThrottle={400}
        style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              props.navigation.goBack();
            }}>
            <Image style={{height: 16, width: 16}} source={backIcon} />
          </TouchableOpacity>
          <Text style={styles.head}>PACKAGES</Text>
          <Text></Text>
        </View>
        <View style={styles.mainView}>
          {packages.map((source, i) => {
            return (
              <LinearGradient
                colors={['#FFDE70', '#FFECAB', '#FFECAB']}
                style={styles.card}
                key={i}>
                <Image
                  style={{
                    height: 30,
                    width: 30,
                    position: 'absolute',
                    right: 10,
                    top: 10,
                  }}
                  source={links.cliniker_purple}
                />
                <View style={{width: '90%', marginVertical: 10}}>
                  <Text style={styles.mainte}>MAXCare Health Checkup</Text>
                  <Text style={styles.text}>
                    Full body health checkup @ {source.fees}
                  </Text>
                </View>
                <Image
                  style={{alignSelf: 'center'}}
                  source={links.packillu}></Image>
                <View style={{width: '90%', marginVertical: 10}}>
                  <Text style={styles.text}>Includes Tests for</Text>
                  <Text style={styles.mainte}>
                    Diabetes | Heart | Kidney | Liver
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    width: '100%',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      //   props.navigation.navigate('PackageDetail', {source})
                      addtocart(source);
                    }}
                    style={styles.appointmentB}>
                    <Text style={{color: colors.white, fontSize: 14}}>
                      BOOK NOW
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('PackageDetail', {source});
                    }}
                    style={[
                      styles.appointmentB,
                      {backgroundColor: 'transparent', borderWidth: 1},
                    ]}>
                    <Text style={{color: colors.purple, fontSize: 14}}>
                      KNOW MORE
                    </Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    backgroundColor: colors.bg,
    flex: 1,
  },
  mainView: {
    flex: 1,
    width: SCREEN_WIDTH - 32,
    alignSelf: 'center',
    paddingBottom: 10,
  },
  header: {
    backgroundColor: colors.white,
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    flexDirection: 'row',
    elevation: 4,
  },
  card: {
    width: '100%',
    // backgroundColor: '#fff',
    marginTop: 16,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 5,
    padding: 10,
    paddingTop: 0,
    borderRadius: 6,
  },
  head: {
    color: '#373737',
    fontSize: 20,
    fontWeight: 'bold',
  },
  username: {
    marginTop: 12,
    width: '100%',
    backgroundColor: '#FFDE70',
    borderRadius: 6,
    height: 52,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  purpletext: {
    color: colors.purple,
    fontWeight: 'bold',
    fontSize: 20,
  },
  textinput: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 6,
    alignSelf: 'center',
    height: 50,
    marginTop: 12,
    paddingLeft: 70,
    color: colors.purple,
    elevation: 4,
  },
  search: {
    height: 30,
    width: 30,
  },
  blogimg: {
    width: SCREEN_WIDTH - 32,
    height: 150,
    alignSelf: 'center',
    borderRadius: 6,
  },
  spacebetween: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
    flexDirection: 'row',
  },
  smalltext: {
    fontSize: 12,
    color: '#646464',
    fontWeight: 'bold',
  },
  seperator: {
    height: 1,
    backgroundColor: '#646464',
    width: '100%',
    marginVertical: 2,
  },
  mainte: {
    fontSize: 15,
    color: '#373737',
    fontWeight: 'bold',
  },
  text: {
    fontSize: 12,
    color: '#373737',
    fontWeight: 'bold',
  },
  appointmentB: {
    height: 33,
    width: 100,
    backgroundColor: colors.purple,
    alignSelf: 'center',
    marginVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
