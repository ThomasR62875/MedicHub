import React, {useState, useEffect} from 'react'
import {
    getDoctors,
    getAdvertisement,
    getAllUsers,
    filterDoctorsByUsers,
    getUserId, getSpecialties, filterDoctorsBySpeciality
} from '../lib/supabase'
import {View, Text, Image, TouchableOpacity, ActivityIndicator} from 'react-native'
import {Button, Icon} from "react-native-elements";
import {useTranslation} from "react-i18next";
import DoctorButton from "../components/DoctorButton";
import {Advertisement, DependentUser, Doctor, Specialty, User} from '../lib/types';
import {styles} from "../assets/styles";
// @ts-ignore
import Squiggle from "../assets/squiggle_pink.png";
import ScrollableBg from "../components/ScrollableBg";
import {SmallBanner} from "../components/SmallBanner"
import {Dialog} from "react-native-paper";
import MyCheckBox from "../components/CheckBox";
import {Dropdown} from "react-native-element-dropdown";

const Doctors: React.FC = ({navigation, route}: any) => {
    const {session} = route.params;
    const [doctors, setDoctors] = useState<Doctor[] | undefined>(undefined)
    const [advertisement,setAdvertisement] = useState<Advertisement | undefined>()
    const {t} = useTranslation();
    const colors = [ 'rgba(139,134,190,0.6)','rgba(222,176,189,0.6)','rgba(236,183,97,0.6)','rgba(203,214,144,0.6)']
    const [isLoading, setIsLoading] = useState(true);
    const [filterUsersDialog, setFilterUserDialog] = useState(false);
    const [filterSpecialitiesDialog, setFilterSpecialitiesDialog] = useState(false);
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const [users, setUsers] = useState<DependentUser[] | undefined>(undefined);
    const [specialities, setSpecialities] = useState<Specialty[] | undefined>(undefined);
    const [specialitiesNames, setSpecialitiesNames] = useState<string[]>([]);
    const [checkedUsersState, setCheckedUsersState] = useState<boolean[]>([]);
    const [checkedSpecialitiesState, setCheckedSpecialitiesState] = useState<boolean[]>([]);
    const [value, setValue] = useState<string | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);

    const data = [
        { label: t('specialty'), value: 'specialty' },
        { label: t('dusers'), value: 'dusers' },
        { label: t('all'), value: 'all' }
    ];


    async function fetchData() {
        if (session) {
            setDoctors(await getDoctors());
            const dependentUsers = await getAllUsers(await getUserId());
            setUsers(dependentUsers);
            setSpecialities(await getSpecialties());
            setAdvertisement( await getAdvertisement('BIG'));
            setIsLoading(false);
        }
    }


    useEffect(() => {
        navigation.addListener('focus', () => {
            fetchData();
            if(users){
                setCheckedUsersState(new Array(users.length).fill(false))
            }
            if(specialities){
                setCheckedSpecialitiesState(new Array(specialities.length).fill(false))
            }
        });

    }, [navigation, session]);


    useEffect(() => {
        if (route.params?.refresh) {
            fetchData()
        }
    }, [route.params?.refresh]);

    const hideFilterUserDialog = () => setFilterUserDialog(false);
    const handleCheckboxUsersChange = (user: DependentUser, index: number) => {
        const updatedCheckedState = [...checkedUsersState];
        updatedCheckedState[index] = !updatedCheckedState[index];
        setCheckedUsersState(updatedCheckedState);

        const isSelected = selectedUserIds.includes(user.id);
        if (isSelected) {
            setSelectedUserIds(selectedUserIds.filter(id => id !== user.id));
        } else {
            setSelectedUserIds([...selectedUserIds, user.id]);
        }
    };

    const hideFilterSpecialitiesDialog = () => setFilterSpecialitiesDialog(false);
    const handleCheckboxSpecialitiesChange = (specialty: Specialty, index: number) => {
        const updatedCheckedState = [...checkedSpecialitiesState];
        updatedCheckedState[index] = !updatedCheckedState[index];
        setCheckedSpecialitiesState(updatedCheckedState);

        const isSelected = specialitiesNames.includes(specialty.name);
        if (isSelected) {
            setSpecialitiesNames(specialitiesNames.filter(name => name !== specialty.name));
        } else {
            setSpecialitiesNames([...specialitiesNames, specialty.name]);
        }
    };


    const handleFilterUsers = async () => {
        if(specialities){
            setCheckedSpecialitiesState(new Array(specialities.length).fill(false))
        }
        if (selectedUserIds.length !== 0) {
            const doctorsAux = await filterDoctorsByUsers(selectedUserIds);
            setDoctors(doctorsAux);
        } else {
            setDoctors([]);
        }
        hideFilterUserDialog();
    };

    const handleFilterSpecialities = async () => {
        if(users){
            setCheckedUsersState(new Array(users.length).fill(false))
        }
        if (specialitiesNames.length !== 0) {
            const doctorsAux = await filterDoctorsBySpeciality(await getUserId(), specialitiesNames);
            setDoctors(doctorsAux);
        } else{
            setDoctors([]);
        }
        hideFilterSpecialitiesDialog();
    };

    const handleChoice = async () => {
        setShowDropdown(true);
    }

    const handleSpecialties = () => {
        setFilterSpecialitiesDialog(true)
    };

    const handleUsers = () => {
        setFilterUserDialog(true)
    };


    const handleShowAll = async () => {
        setDoctors(await getDoctors());
    };

    const renderItem = (item: { label: any; }) => (
        <View style={styles.item}>
            <Text style={styles.textStyle}>{item.label}</Text>
            <View style={styles.separator} />
        </View>
    );

    const handleChange = (item: { value: string }) => {
        setValue(item.value);
        if (item.value === 'specialty') {
            handleSpecialties();
        } else if (item.value === 'dusers') {
            handleUsers();
        } else if(item.value === 'all') {
            handleShowAll()
        }
        setShowDropdown(false);
    };


    return (
        <View style={styles.tab}>
            <Image source={Squiggle} style={styles.squiggle_left}/>
            <View style={{flexDirection: 'row', justifyContent: 'space-between',flex:0, marginTop: '15%', marginHorizontal: '5%'}}>
                <Icon name={'arrow-left'} type={'material-community'} style={styles.back_arrow} onPress={() => navigation.navigate('HomeTabs')}></Icon>
            </View>
            <Text style={[styles.stackTitle]}>
                {t('doctors')}
            </Text>
            <ScrollableBg>
                <View style={{flexDirection: 'row', justifyContent: 'space-between',flex:0, margin: '5%', marginBottom: '2.5%'}}>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => navigation.navigate('AddDoctor', {session: session})}
                    >
                        <Text style={styles.buttonText}>{t('add')}</Text>
                    </TouchableOpacity>
                    {!showDropdown && (
                        <Icon
                            name={'filter-variant'}
                            type={'material-community'}
                            color={'#000000'}
                            size={30}
                            style={{ paddingRight: 20, padding: 5 }}
                            onPress={handleChoice}
                        />
                    )}
                    {showDropdown && (
                        <Dropdown
                            style={styles.dropdown}
                            selectedTextStyle={styles.textStyle}
                            placeholderStyle={{ padding: '5%' }}
                            data={data}
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder={t('filter')}
                            containerStyle={styles.dropdownContainer}
                            value={value}
                            renderItem={renderItem}
                            onChange={handleChange}
                        />
                    )}
                </View>
                <View style={styles.listCards}>
                    {isLoading ? (
                        <ActivityIndicator size="small" color="#807d7d" style={{marginVertical: '10%'}}/>
                    ) : (doctors && doctors?.length > 0  ? (
                        doctors.map((doc: Doctor, i) => {
                            return (
                                <View key={i}>
                                    <DoctorButton onPress={() => navigation.navigate({name: 'SingleDoctor', params: {doc: doc}})}>
                                        <View style={{flexDirection: 'row'}}>
                                            <Icon iconStyle={{color: 'white', fontSize: 16, padding: 5}} containerStyle={[styles.circleCard, {backgroundColor: colors[i%4]}]} name={'stethoscope'} type={'material-community'}/>
                                            <View style={{flexDirection: 'column', paddingHorizontal: 14}}>
                                                <Text style={[{fontSize: 14, paddingVertical: 7}]}>{doc.name}</Text>
                                                <Text style={[styles.text2, {fontSize: 12, width: '150%', paddingBottom: 5}]}>{t(doc.specialty)}</Text>
                                            </View>
                                        </View>
                                    </DoctorButton>
                                </View>
                            )
                        })
                    ) : (
                        <Text style={[styles.text2,{alignSelf: 'center', padding: 30}]}>{t('text17')}</Text>
                    )
                    )}
                    <SmallBanner advertisement={advertisement} onPress={(doc:Doctor | undefined)=>navigation.navigate({name:'AddDoctor',params:{base_doctor:doc}})}/>
                </View>
            </ScrollableBg>
                <Dialog style={styles.dialog} visible={filterUsersDialog} onDismiss={hideFilterUserDialog}>
                    <Dialog.Actions>
                        <ScrollableBg>
                            <Text style={styles.dialogTitle}>{t("selectUsers")}</Text>
                            {users?.map((item, index) => (
                                <View key={item.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, paddingLeft: 20 }}>
                                    <MyCheckBox
                                        disabled={false}
                                        value={checkedUsersState[index]}
                                        onValueChange={() => handleCheckboxUsersChange(item, index)}
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
                                onPress={handleFilterUsers}
                            />
                        </ScrollableBg>
                    </Dialog.Actions>
                </Dialog>

            <Dialog style={styles.dialog} visible={filterSpecialitiesDialog} onDismiss={hideFilterSpecialitiesDialog}>
                <Dialog.Actions>
                    <ScrollableBg>
                        <Text style={styles.dialogTitle}>{t("selSpec")}</Text>
                        {specialities?.map((item, index) => (
                            <View key={item.name} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, paddingLeft: 20 }}>
                                <MyCheckBox
                                    disabled={false}
                                    value={checkedSpecialitiesState[index]}
                                    onValueChange={() => handleCheckboxSpecialitiesChange(item, index)}
                                    text={t(item.name)}
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
                            onPress={handleFilterSpecialities}
                        />
                    </ScrollableBg>
                </Dialog.Actions>
            </Dialog>
        </View>
    )
}

export default Doctors;
