import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Image,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import colors from '../components/colors';
import links from '../components/links';
import {Rating} from '../components/ratings/index.tsx';
// import {getDoctorList, getClinicList} from '../services/firebase';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
import auth from '@react-native-firebase/auth';
import getDistance from 'geolib/es/getDistance';

import firestore from '@react-native-firebase/firestore';
const Lab = [
  {
    id: '1',
    name: 'cold',
  },
  {
    id: '2',
    name: 'Fever',
  },
  {
    id: '3',
    name: 'HeadAche',
  },
];

export default function LabSearch({navigation}) {
  const [labs, setlabs] = useState([]);
  const [lastclinic, setlastclinic] = useState(null);

  const [labsfilter, setlabsfilter] = useState([]);
  const [diseases, setdiseases] = useState([
    {
      id: '1',
      name: 'Acidity',
      link: links.Acidity,
    },
    {
      id: '2',
      name: 'Acne Pimples',
      link: links.Acne_Pimples,
    },
    {
      id: '3',
      name: 'Blood Pressure',
      link: links.Blood_Pressure,
    },
    {
      id: '4',
      name: 'Cough Cold',
      link: links.Cough_Cold,
    },
    {
      id: '5',
      name: 'Diabetes',
      link: links.Diabetes,
    },
    {
      id: '6',
      name: 'Fever',
      link: links.Fever,
    },
    {
      id: '7',
      name: 'Fracture Joint Displacement',
      link: links.Fracture_Joint_Displacement,
    },
    {
      id: '8',
      name: 'Headache Migrains',
      link: links.Headache_Migrains,
    },
    {
      id: '9',
      name: 'Insomnia',
      link: links.Insomnia,
    },
    {
      id: '10',
      name: 'Muscle pain',
      link: links.Muscle_pain,
    },
    {
      id: '11',
      name: 'Obesity',
      link: links.Obesity,
    },
    {
      id: '12',
      name: 'Period Issue',
      link: links.Period_Issue,
    },
    {
      id: '13',
      name: 'Preganancy',
      link: links.Preganancy,
    },
    {
      id: '14',
      name: 'Stomach Ache',
      link: links.Stomach_Ache,
    },
    {
      id: '15',
      name: 'Throat Pain',
      link: links.Throat_Pain,
    },
    {
      id: '16',
      name: 'Tooth Ache',
      link: links.Tooth_Ache,
    },
    {
      id: '17',
      name: 'Weak eyesight',
      link: links.Weak_eyesight,
    },
    {
      id: '18',
      name: 'Weight loss',
      link: links.Weight_loss,
    },
  ]);
  const [specialisation, setspecialisation] = useState([
    {
      id: '1',
      name: 'Ayurveda Specialist',
      link: links.ayurveda_specialist,
    },
    {
      id: '2',
      name: 'Cardiologiest',
      link: links.cardiologiest,
    },
    {
      id: '3',
      name: 'Dentist',
      link: links.dentist,
    },
    {
      id: '4',
      name: 'Dermatologist',
      link: links.Dermatologist,
    },
    {
      id: '5',
      name: 'Diabetologist',
      link: links.diabetologist,
    },
    {
      id: '6',
      name: 'Dieticians',
      link: links.Dieticians,
    },
    {
      id: '7',
      name: 'Gastroenterologist',
      link: links.gastroenterologist,
    },
    {
      id: '8',
      name: 'Gynaecologist',
      link: links.gynaecologist,
    },
    {
      id: '9',
      name: 'Homeopath',
      link: links.homeopath,
    },
    {
      id: '10',
      name: 'Opthalmologist',
      link: links.Opthalmologist,
    },
    {
      id: '11',
      name: 'Orthopedician',
      link: links.orthopedician,
    },
    {
      id: '12',
      name: 'Pediatrician',
      link: links.pediatrician,
    },
    {
      id: '13',
      name: 'Physician',
      link: links.physician,
    },
    {
      id: '14',
      name: 'Physiotherapist',
      link: links.physiotherapist,
    },
  ]);
  const [searchquery, setsearchquery] = useState('');
  const [knowmore, setknowmore] = useState();

  const [addressadded, setaddressadded] = useState(false);
  const [activeaddress, setactiveaddress] = useState({});
  const [lastDocs, setlastDocs] = useState(new Map());

  useEffect(() => {
    // setcompletelabs();
    const user = auth().currentUser;
    // checkifaddressadded(user.uid);
  }, []);

  const onChangeSearch = query => {
    setsearchquery(query);
    // setlabsfilter(
    //   labs.filter(
    //     i =>
    //       i.test_name.toLowerCase().includes(query.toLowerCase()) ||
    //       i.clinic_name.toLowerCase().includes(query.toLowerCase()),
    //   ),
    // );
    // getLabssearchlist();
  };

  const checkifaddressadded = uid => {
    const subscriber = firestore()
      .collection('user')
      .doc(uid)
      .onSnapshot(documentSnapshot => {
        console.log('User data: ', documentSnapshot.data().activeaddress);
        setactiveaddress(documentSnapshot.data().activeaddress);
        if (
          documentSnapshot.data().activeaddress.lat > 0 &&
          documentSnapshot.data().activeaddress.lon > 0
        ) {
          setaddressadded(true);
        }
        // setactivefamily(documentSnapshot.data().activefamily);
      });
  };

  const getDistancefromact = (lat, long) => {
    // console.log(pos);
    if (lat != undefined && long != undefined) {
      let k = getDistance(
        {latitude: activeaddress.lat, longitude: activeaddress.lon},
        {latitude: lat, longitude: long},
      );
      return k / 1000;
    } else return 'NA';
  };

  async function addtocart(source) {
    console.log('source ', source);
    console.log('source', source.fees);
    // console.log(JSON.stringify(source, null, 2))
    navigation.navigate('BooklabCalender', {source});
  }

  // async function setcompletelabs() {
  //   // setpackages([]);
  //   let t = 1;
  //   const lab = await firestore()
  //     .collection('clinics')
  //     .orderBy(firestore.FieldPath.documentId())
  //     .limit(2)
  //     .get()
  //     .then(querySnapshot => {
  //       const temp = [];
  //       querySnapshot.forEach(async documentSnapshot1 => {
  //         // console.log(documentSnapshot1.id);
  //         await firestore()
  //           .collection('clinics')
  //           .doc(documentSnapshot1.id)
  //           .collection('labtests')
  //           .limit(5)
  //           .get()
  //           .then(querySnapshot => {
  //             querySnapshot.forEach(documentSnapshot2 => {
  //               console.log(t++);
  //               temp.push({
  //                 test_name: documentSnapshot2.data().package_name,
  //                 lab_name: documentSnapshot2.data().lab_name,
  //                 clinic_name: documentSnapshot1.data().name,
  //                 fees: documentSnapshot2.data().fees,
  //                 clinic: {
  //                   facility: documentSnapshot1.data().facility,
  //                   id: documentSnapshot1.data().id,
  //                   image: documentSnapshot1.data().image,
  //                   location: documentSnapshot1.data().location,
  //                   name: documentSnapshot1.data().name,
  //                   rating: documentSnapshot1.data().rating,
  //                   time: documentSnapshot1.data().time,
  //                 },
  //                 type: 'labtest',
  //                 lab_id: documentSnapshot2.data().max_lab_id,
  //                 date: new Date(),
  //                 lon: documentSnapshot1.data().location.long,
  //                 lat: documentSnapshot1.data().location.lat,
  //               });
  //             });
  //           });

  //         setlastclinic(documentSnapshot1.id);
  //       });
  //       // setpackages(...packages, temp);
  //       setlabs(temp);
  //     });
  //   console.log('packages ', labs);
  // }

  async function retrieveMore() {
    const lab = await firestore()
      .collection('clinics')
      .get()
      .then(querySnapshot => {
        const temp = [];
        querySnapshot.forEach(async documentSnapshot1 => {
          console.log(lastDocs.get(documentSnapshot1.id));
          await firestore()
            .collection('clinics')
            .doc(documentSnapshot1.id)
            .collection('labtests')
            // .orderBy('searchfield')
            .orderBy(firestore.FieldPath.documentId())
            .where('searchfield', 'array-contains', searchquery)
            .startAfter(lastDocs.get(documentSnapshot1.id))
            .limit(2)
            .get()
            .then(querySnapshot => {
              querySnapshot.forEach(documentSnapshot2 => {
                console.log(documentSnapshot2.id);
                if (labsfilter.some(item => item.id == documentSnapshot2.id)) {
                  console.log('already there');
                } else {
                  setlabsfilter(prevstate => [
                    ...prevstate,
                    {
                      id: documentSnapshot2.id,
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
                }
                setlastDocs(
                  lastDocs.set(documentSnapshot1.id, documentSnapshot2.id),
                );
              });
            });
        });
      });
  }

  async function getLabssearchlist() {
    setlabsfilter([]);
    const lab = await firestore()
      .collection('clinics')
      .get()
      .then(querySnapshot => {
        const temp = [];
        querySnapshot.forEach(async documentSnapshot1 => {
          // console.log(documentSnapshot1.id);
          await firestore()
            .collection('clinics')
            .doc(documentSnapshot1.id)
            .collection('labtests')
            // .orderBy('package_name')
            // .startAt(searchquery)
            // .endAt(searchquery + '\uf8ff')
            // .limit(5)
            // .orderBy('searchfield')
            // .orderBy('name')
            .orderBy(firestore.FieldPath.documentId())
            .where('searchfield', 'array-contains', searchquery)
            // .where('name', '>=', searchquery)
            .limit(2)
            .get()
            .then(querySnapshot => {
              querySnapshot.forEach(documentSnapshot2 => {
                console.log(documentSnapshot2.id);
                setlabsfilter(prevstate => [
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
                console.log(lastDocs.get(documentSnapshot1.id), 'lastdoc');
              });
            });
        });
        // setlabsfilter(temp);
      });
  }

  const ItemViewDisease = ({item, index}) => {
    return (
      <View style={{padding: 5}}>
        <TouchableOpacity onPress={() => {}}>
          <View>
            <View
              style={{
                // height: 100,
                width: (SCREEN_WIDTH - 60) / 4,
                alignItems: 'center',
              }}>
              <Image
                source={item.link}
                style={{
                  height: (SCREEN_WIDTH - 60) / 6.5,
                  width: (SCREEN_WIDTH - 60) / 6.5,
                  borderRadius: 30,
                  backgroundColor: colors.grey,
                }}></Image>
              <Text
                style={{
                  color: colors.dark,
                  paddingTop: 2,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  fontSize: 14,
                }}>
                {item.name}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const ItemSeparatorViewDisease = () => {
    return <View style={{}} />;
  };

  const ItemViewSpecialisation = ({item, index}) => {
    return (
      <View style={{padding: 5}} key={index}>
        <TouchableOpacity onPress={() => {}}>
          <View>
            <View
              style={{
                height: 100,
                width: (SCREEN_WIDTH - 40) / 2,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.dark,
                flexDirection: 'row',
                borderRadius: 15,
              }}>
              <View
                style={{
                  width: '40%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={item.link}
                  style={{
                    height: (SCREEN_WIDTH - 60) / 6.5,
                    width: (SCREEN_WIDTH - 60) / 6.5,
                    borderRadius: 30,
                    backgroundColor: colors.grey,
                  }}></Image>
              </View>
              <View
                style={{
                  width: '60%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  numberOfLines={2}
                  style={{
                    color: colors.white,
                    alignSelf: 'center',
                    paddingTop: 2,
                    paddingHorizontal: 5,
                  }}>
                  {item.name}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const ItemSeparatorViewSpecialisation = () => {
    return <View style={{}} />;
  };

  const renderItem = ({source, i}) => (
    <View style={styles.doctorlist} key={i}>
      <View style={styles.up}>
        <View>
          <Image source={links.clinic} style={styles.thumb} />
          <View
            style={{
              height: 20,
              alignItems: 'center',
              justifyContent: 'center',
              // width: 100,
              paddingHorizontal: 3,
              backgroundColor: '#979797CC',
              alignSelf: 'center',
              borderRadius: 7,
              marginTop: 2,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image style={{marginRight: 2}} source={links.loc} />
              <Text
                style={{
                  color: colors.black,
                  fontWeight: 'bold',
                  opacity: 0.5,
                  fontSize: 11,
                }}>
                {addressadded ? getDistancefromact(source.lat, source.lon) : ''}{' '}
                km
              </Text>
            </View>
          </View>
        </View>
        <View style={{marginLeft: 7, width: '50%', alignItems: 'flex-start'}}>
          <Text style={[styles.name, {}]}>{source.test_name} </Text>
          <Text style={[styles.profession, {}]}>{source.clinic_name}</Text>

          {/* <Text style={styles.experieance}>
            {source.experience} years of Experience overall
          </Text> */}
          {/* <Text style={styles.stories}>55 Happy Patients Stories</Text> */}
          <Text style={[styles.profession, {opacity: 0.5}]}>
            25 Tests in Total
          </Text>
        </View>
        <View
          style={{
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginTop: 10,
            width: 80,
          }}>
          <Text style={{fontSize: 12, fontWeight: 'bold', color: colors.black}}>
            Report In{' '}
            <Text style={{fontSize: 12, fontWeight: 'bold', color: '#373737'}}>
              5 hours
            </Text>
          </Text>
        </View>
      </View>
      {/* <View style={styles.seperator}></View> */}
      <View style={styles.down}>
        {/* Book Appointment*/}
        <View style={styles.bet}>
          <View style={{}}>
            <Text style={styles.profession}>
              Consultation Fees -
              <Text style={styles.stories}>₹ {source.fees} </Text>
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              // navigation.navigate('Cart');
              addtocart(source);
            }}
            style={styles.appointmentB}>
            <Text style={{color: colors.white, fontSize: 14}}>Book lab</Text>
          </TouchableOpacity>
        </View>
      </View>
      {knowmore == i ? (
        <View style={{paddingHorizontal: 10, paddingBottom: 15}}>
          <View
            style={{
              height: 1,
              width: '90%',
              backgroundColor: '#D2D2D2',
              position: 'absolute',
              top: 13,
              alignSelf: 'center',
            }}
          />
          <TouchableOpacity
            onPress={() => setknowmore(null)}
            style={{
              height: 26,
              width: 100,
              borderColor: '#D2D2D2',
              borderWidth: 1,
              borderRadius: 12,
              alignSelf: 'center',
              backgroundColor: colors.white,
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: '#646464',
                fontWeight: 'bold',
              }}>
              Show less
            </Text>
          </TouchableOpacity>
          <View style={{marginVertical: 15}}>
            <View>
              <Text style={styles.mainT}>Sample Collection</Text>
              <Text style={styles.subT}>
                {source.sample_collection_facility}
              </Text>
            </View>
            <View style={{marginTop: 10}}>
              <Text style={styles.mainT}>Requirements</Text>
              <Text style={styles.subT}>{source.Requirements}</Text>
            </View>
          </View>
          <View
            style={{
              backgroundColor: '#FFDE70',
              borderRadius: 12,
              padding: 10,
            }}>
            <Text style={styles.mainT}>Test Included(x)</Text>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{width: '100%'}}>
                {source.tests_included.split(',').map((item, ind) => {
                  return (
                    <Text style={styles.mainT}>
                      {ind + 1}. {item}
                    </Text>
                  );
                })}
              </View>
            </View>
          </View>
          <View style={{marginTop: 10}}>
            <Text style={styles.mainT}>Note</Text>
            {source.Note.split('\n').map((item, ind) => {
              return (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.subT}>{item}</Text>
                </View>
              );
            })}
          </View>
          <View style={{marginTop: 10}}>
            <Text style={styles.mainT}>Process</Text>
            <View>
              {source.Process.split('\n').map((item, ind) => {
                return (
                  <View>
                    {ind == 0 ? null : (
                      <View
                        style={{
                          height: 35,
                          width: 1,
                          backgroundColor: '#00000029',
                          marginLeft: 5,
                        }}></View>
                    )}

                    <View
                      style={{
                        flexDirection: 'row',
                        // justifyContent: 'center',
                      }}>
                      <View
                        style={{
                          height: 10,
                          width: 10,
                          borderRadius: 8,
                          backgroundColor: colors.purple,
                          alignSelf: 'center',
                          marginRight: 5,
                        }}
                      />
                      <Text
                        style={{
                          color: '#7F8386',
                          fontSize: 13,
                          fontWeight: 'bold',
                        }}>
                        {item.slice(2)}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => {
            setknowmore(i);
          }}
          style={{
            marginBottom: 10,
            alignItems: 'center',
            alignContent: 'center',
            alignSelf: 'center',
            flexDirection: 'row',
          }}>
          <Text style={[styles.stories, {textAlign: 'center'}]}>knowmore</Text>
          <Image
            style={{height: 12, width: 12, marginLeft: 4}}
            source={links.arrow_down}
          />
        </TouchableOpacity>
      )}
    </View>
  );

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
            if (searchquery.length > 0) {
              console.log('end');
              retrieveMore();
            }
          }
        }}
        scrollEventThrottle={400}
        style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.searchT}>Search</Text>
          <View style={{marginBottom: 10}}>
            <TextInput
              style={styles.Input}
              value={searchquery}
              editable
              placeholder={'Search doctors, Labs and more'}
              placeholderTextColor={colors.dark}
              onChangeText={onChangeSearch}
              onSubmitEditing={({nativeEvent: {text, eventCount, target}}) => {
                console.log(text);
                getLabssearchlist();
              }}
            />
            <TouchableOpacity
              onPress={() => {
                console.log('search');
                getLabssearchlist();
              }}
              style={{position: 'absolute', elevation: 4, top: 20}}>
              <Image
                source={links.search}
                style={{
                  // position: 'absolute',
                  height: 30,
                  width: 30,
                  // top: 20,
                  // left: 40,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
        {searchquery.length == 0 ? (
          <View style={styles.mainView}>
            <View style={styles.space_between}>
              <Text style={styles.heading}>Search by Diseases</Text>
            </View>
            <View style={styles.dname}>
              <FlatList
                data={diseases}
                scrollEnabled={false}
                numColumns={4}
                renderItem={ItemViewDisease}
                ItemSeparatorComponent={ItemSeparatorViewDisease}
                style={{
                  paddingHorizontal: 10,
                  marginTop: 10,
                }}
              />
            </View>
            <View style={styles.space_between}>
              <Text style={styles.heading}>Search by Specialisation</Text>
            </View>
            <View style={styles.dname}>
              <FlatList
                data={specialisation}
                scrollEnabled={false}
                numColumns={2}
                renderItem={ItemViewSpecialisation}
                ItemSeparatorComponent={ItemSeparatorViewSpecialisation}
                style={{
                  paddingHorizontal: 10,
                  marginTop: 10,
                }}
              />
            </View>
          </View>
        ) : (
          <View style={styles.mainView}>
            {labsfilter.map((source, i) => {
              return (
                <View key={source.doc_id} style={{paddingHorizontal: 16}}>
                  {renderItem({source, i})}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    backgroundColor: colors.bg,
    flex: 1,
  },
  searchT: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.grey,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    paddingTop: Platform.OS === 'android' ? 15 : 0,
    borderBottomRightRadius: 40,
    borderBottomLeftRadius: 40,
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  mainView: {
    flex: 1,
    backgroundColor: colors.bg,
    width: SCREEN_WIDTH,
    alignSelf: 'center',
    marginTop: 5,
  },
  bet: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  space_between: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 16,
  },
  Input: {
    backgroundColor: colors.white,
    borderRadius: 20,
    color: colors.dark,
    textAlign: 'center',
    fontWeight: 'bold',
    width: SCREEN_WIDTH - 50,
    fontSize: 12,
    height: 55,
    marginVertical: 5,
    opacity: 0.7,
  },
  dname: {
    width: '100%',
    backgroundColor: colors.white,
    marginTop: 10,
    borderRadius: 20,
  },
  doctorlist: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 12,
    marginVertical: 20,
    elevation: 4,
    paddingTop: 10,
  },
  thumb: {
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 70,
    width: 80,
    height: 80,
    alignSelf: 'center',
  },
  up: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.black,
  },
  profession: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.black,
    opacity: 0.7,
  },
  experieance: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.black,
  },
  stories: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.purple,
    opacity: 0.9,
  },
  seperator: {
    width: '95%',
    alignSelf: 'center',
    height: 1,
    backgroundColor: '#707070',
    marginVertical: 10,
  },
  down: {
    paddingHorizontal: 10,
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
  knowmore: {
    height: 40,
    width: 150,
    backgroundColor: '#835CB961',
    alignSelf: 'center',
    marginVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainT: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#373737',
  },
  subT: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.black,
    opacity: 0.5,
  },
  dot: {
    height: 4,
    width: 4,
    borderRadius: 4,
    backgroundColor: '#373737',
    marginRight: 3,
  },
});
