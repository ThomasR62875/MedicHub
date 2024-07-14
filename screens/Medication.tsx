import React, {useState, useEffect} from 'react'
import {View, Text, Image, TouchableOpacity, ActivityIndicator} from 'react-native'
import {
    filterDoctorsByUsers,
    filterMedicationsByUsers,
    getAdvertisement, getAllUsers,
    getDoctors,
    getMedications, getUserId
} from '../lib/supabase'
import MedicationButton from "../components/MedicationButton";
import {Button, Icon} from "react-native-elements";
import {useTranslation} from "react-i18next";
import {Advertisement, DependentUser, Doctor, Medication} from '../lib/types';
import {styles} from "../assets/styles";
// @ts-ignore
import Squiggle from "../assets/squiggle_pink.png";
import ScrollableBg from "../components/ScrollableBg";
import { SmallBanner } from '../components/SmallBanner';
import {Dialog} from "react-native-paper";
import MyCheckBox from "../components/CheckBox";

const Medications: React.FC = ({navigation, route}: any) => {
    const session = route.params.session;
    const [medications, setMedications] = useState<Medication[] | undefined>(undefined)
    const {t} = useTranslation();
    const colors = ['rgba(139,134,190,0.6)', 'rgba(222,176,189,0.6)', 'rgba(236,183,97,0.6)', 'rgba(203,214,144,0.6)']
    const [isLoading, setIsLoading] = useState(true);
    const [advertisement,setAdvertisement] = useState<Advertisement | undefined>()
    const [filterDialog, setFilterDialog] = useState(false);
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const [users, setUsers] = useState<DependentUser[] | undefined>(undefined)
    const [checkedState, setCheckedState] = useState<boolean[]>([]);


    useEffect(() => {
        navigation.addListener('focus', () => {
            async function fetchData() {
                if (session) {
                    setMedications(await getMedications());
                    const dependentUsers = await getAllUsers(await getUserId());
                    setUsers(dependentUsers);
                    setAdvertisement( await getAdvertisement('BIG'));
                    setIsLoading(false);
                }
            }
            fetchData();
            if(users){
                setCheckedState(new Array(users.length).fill(false))
            }
        });
    }, [navigation, session]);

    const hideFilterDialog = () => setFilterDialog(false);
    const handleCheckboxChange = (user: DependentUser, index: number) => {
        const updatedCheckedState = [...checkedState];
        updatedCheckedState[index] = !updatedCheckedState[index];
        setCheckedState(updatedCheckedState);

        const isSelected = selectedUserIds.includes(user.id);
        if (isSelected) {
            setSelectedUserIds(selectedUserIds.filter(id => id !== user.id));
        } else {
            setSelectedUserIds([...selectedUserIds, user.id]);
        }
    };


    const handleFilter = async () => {
        if (selectedUserIds.length === 0) {
            setMedications(await getMedications())
        } else{
            const medicationsAux = await filterMedicationsByUsers(selectedUserIds);
            setMedications(medicationsAux);
        }
        hideFilterDialog();
    };


    return (
        <View style={styles.tab}>
            <Image source={Squiggle} style={styles.squiggle_left}/>
            <View style={{flexDirection: 'row', justifyContent: 'space-between',flex:0, marginTop: '15%', marginHorizontal: '5%'}}>
                <Icon name={'arrow-left'} type={'material-community'} style={styles.back_arrow} onPress={() => navigation.navigate('HomeTabs')}></Icon>
            </View>
            <Text style={[styles.stackTitle]}>
                {t('medicine')}
            </Text>
            <ScrollableBg>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    flex: 0,
                    margin: '5%',
                    marginBottom: '2.5%'
                }}>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => navigation.navigate('AddMedication', {session: session})}
                    >
                        <Text style={styles.buttonText}>{t('add')}</Text>
                    </TouchableOpacity>
                    <Icon name={'filter-variant'} type={'material-community'} color={'#000000'} size={30} style={{paddingRight: 20, padding: 5}} onPress={() => setFilterDialog(true)} />
                </View>
                <View style={styles.listCards}>
                    {isLoading ? (
                        <ActivityIndicator size="small" color="#807d7d" style={{marginVertical: '10%'}}/>
                    ) : (medications && medications.length > 0 ? (
                            medications.map((medic: Medication, i) => {
                                return (
                                    <View key={i}>
                                        <MedicationButton onPress={() => navigation.navigate({
                                            name: 'SingleMedication',
                                            params: {meds: medic}
                                        })}>
                                            <View style={{flexDirection: 'row'}}>
                                                <Icon iconStyle={{color: 'white', fontSize: 16, padding: 5}}
                                                      containerStyle={[styles.circleCard, {backgroundColor: colors[i % 4]}]}
                                                      name={'pill'} type={'material-community'}/>
                                                <View style={{flexDirection: 'column', paddingHorizontal: 14}}>
                                                    <Text
                                                        style={[{fontSize: 14, paddingVertical: 7}]}>{medic.name}</Text>
                                                    <Text style={[styles.text2, {
                                                        fontSize: 12,
                                                        width: '150%',
                                                        paddingBottom: 5
                                                    }]}>{medic.prescription}{medic.howOften != null ? ', ' + t('every') + ' ' + parseInt(medic.howOften.toString().split(':')[0], 10) + t('text24') : ''}</Text>
                                                </View>
                                            </View>


                                        </MedicationButton>
                                    </View>
                                )
                            })
                        ) : (
                            <Text style={[styles.text2, {alignSelf: 'center', padding: 30}]}>{t('text16')}</Text>
                        ))
                    }
                    <SmallBanner advertisement={advertisement} onPress={(doc:Doctor | undefined)=>navigation.navigate({name:'AddDoctor',params:{base_doctor:doc}})}/>

                </View>
            </ScrollableBg>
            <Dialog style={styles.dialog} visible={filterDialog} onDismiss={hideFilterDialog}>
                <Dialog.Actions>
                    <ScrollableBg>
                        <Text style={styles.dialogTitle}>{t("selectUsers")}</Text>
                        {users?.map((item, index) => (
                            <View key={item.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, paddingLeft: 20 }}>
                                <MyCheckBox
                                    disabled={false}
                                    value={checkedState[index]}
                                    onValueChange={() => handleCheckboxChange(item, index)}
                                    text={item.first_name + ' ' + item.last_name}
                                />
                            </View>
                        ))}
                        <Button
                            title={t('filter')}
                            buttonStyle={{
                                backgroundColor: '#86ABBA',
                                borderWidth: 2,
                                borderColor: 'white',
                                borderRadius: 30,
                                minHeight: 50
                            }}
                            containerStyle={{
                                width: 200,
                                marginHorizontal: '13%',
                                marginVertical: 10,
                                marginTop: 20,
                                alignContent: 'center'
                            }}
                            titleStyle={{ color: '#fff' }}
                            onPress={handleFilter}
                        />
                    </ScrollableBg>
                </Dialog.Actions>
            </Dialog>
        </View>
    )
}

export default Medications;