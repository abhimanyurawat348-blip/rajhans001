import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { studentCouncilMembers } from '../data/studentCouncil';
import { Crown, Shield, Trophy, Users, Music, Zap, Star, Calendar } from 'lucide-react';
import MeetingFlashcard from '../components/MeetingFlashcard';

const StudentCouncil: React.FC = () => {
  const [meetings, setMeetings] = useState<any[]>([]);

  // Load meetings
  useEffect(() => {
    const loadMeetings = async () => {
      try {
        const meetingsQuery = query(
          collection(db, 'meetings'),
          orderBy('date', 'desc'),
          limit(5) // Load only the 5 most recent meetings
        );
        const meetingsSnapshot = await getDocs(meetingsQuery);
        const meetingsData = meetingsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date()
        }));
        setMeetings(meetingsData);
      } catch (err) {
        console.error('Error loading meetings:', err);
      }
    };

    loadMeetings();
  }, []);

  const getHouseColor = (house?: string) => {
    switch (house) {
      case 'Red': return 'from-red-400 to-red-600';
      case 'Blue': return 'from-blue-400 to-blue-600';
      case 'Yellow': return 'from-yellow-400 to-yellow-600';
      case 'Green': return 'from-green-400 to-green-600';
      default: return 'from-purple-400 to-purple-600';
    }
  };

  const getCategoryIcon = (category: string, house?: string) => {
    switch (category) {
      case 'leadership': return <Crown className="h-6 w-6" />;
      case 'discipline': return <Shield className="h-6 w-6" />;
      case 'sports': return <Trophy className="h-6 w-6" />;
      case 'house': return <Users className="h-6 w-6" />;
      case 'activity': 
        if (house) return <Zap className="h-6 w-6" />;
        return <Music className="h-6 w-6" />;
      default: return <Star className="h-6 w-6" />;
    }
  };

  const leadership = studentCouncilMembers.filter(m => m.category === 'leadership');
  const discipline = studentCouncilMembers.filter(m => m.category === 'discipline');
  const sports = studentCouncilMembers.filter(m => m.category === 'sports');
  const yellowHouse = studentCouncilMembers.filter(m => m.house === 'Yellow');
  const greenHouse = studentCouncilMembers.filter(m => m.house === 'Green');
  const redHouse = studentCouncilMembers.filter(m => m.house === 'Red');
  const blueHouse = studentCouncilMembers.filter(m => m.house === 'Blue');
  const activities = studentCouncilMembers.filter(m => m.category === 'activity');

  interface Member { name: string; position: string; house?: string; category: string }
  const MemberCard: React.FC<{ member: Member; index: number }> = ({ member, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
    >
      <div className={`h-32 bg-gradient-to-br ${getHouseColor(member.house)} relative`}>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute bottom-4 left-4 text-white">
          {getCategoryIcon(member.category, member.house)}
        </div>
        {member.house && (
          <div className="absolute top-4 right-4">
            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-medium">
              {member.house} House
            </span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
        <p className={`font-semibold mb-3 ${
          member.house 
            ? member.house === 'Red' ? 'text-red-600' 
              : member.house === 'Blue' ? 'text-blue-600'
              : member.house === 'Yellow' ? 'text-yellow-600'
              : 'text-green-600'
            : 'text-purple-600'
        }`}>
          {member.position}
        </p>
        
        <div className="flex items-center justify-between">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            member.category === 'leadership' ? 'bg-purple-100 text-purple-800' :
            member.category === 'discipline' ? 'bg-blue-100 text-blue-800' :
            member.category === 'sports' ? 'bg-green-100 text-green-800' :
            member.category === 'house' ? 'bg-orange-100 text-orange-800' :
            'bg-pink-100 text-pink-800'
          }`}>
            {member.category === 'leadership' ? 'Leadership' :
             member.category === 'discipline' ? 'Discipline' :
             member.category === 'sports' ? 'Sports' :
             member.category === 'house' ? 'House' :
             'Activity'
            }
          </div>
        </div>
      </div>
    </motion.div>
  );

  const SectionHeader: React.FC<{ title: string; subtitle?: string; icon: React.ReactNode; color: string }> = 
    ({ title, subtitle, icon, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-12"
    >
      <div className={`${color} w-16 h-16 rounded-full flex items-center justify-center text-white mx-auto mb-4`}>
        {icon}
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
      {subtitle && <p className="text-lg text-gray-600">{subtitle}</p>}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Crown className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Student Council
            </h1>
            <p className="text-2xl text-gray-600 mb-4">2025–2026</p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent max-w-4xl mx-auto"
            >
              <p className="text-2xl md:text-3xl font-bold italic leading-relaxed">
                "Leadership is not about a title or a position, it's about impact and inspiration."
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Upcoming Meetings Section */}
      {meetings.length > 0 && (
        <section className="py-12 px-4 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 w-16 h-16 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                <Calendar className="h-8 w-8" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Upcoming Meetings</h2>
              <p className="text-lg text-gray-600">Important meetings scheduled by the school administration</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {meetings.map((meeting) => (
                <MeetingFlashcard key={meeting.id} meeting={meeting} />
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 pb-20">
        {/* Leadership Section */}
        <section className="mb-20">
          <SectionHeader 
            title="School Leadership" 
            subtitle="Leading with vision and integrity"
            icon={<Crown className="h-8 w-8" />}
            color="bg-gradient-to-r from-purple-500 to-purple-600"
          />
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {leadership.map((member, index) => (
              <MemberCard key={`leadership-${index}`} member={member} index={index} />
            ))}
          </div>
        </section>

        {/* Discipline Section */}
        <section className="mb-20">
          <SectionHeader 
            title="Discipline Team" 
            subtitle="Maintaining order and fostering respect"
            icon={<Shield className="h-8 w-8" />}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
          />
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {discipline.map((member, index) => (
              <MemberCard key={`discipline-${index}`} member={member} index={index} />
            ))}
          </div>
        </section>

        {/* Sports Section */}
        <section className="mb-20">
          <SectionHeader 
            title="Sports Leadership" 
            subtitle="Promoting fitness and sportsmanship"
            icon={<Trophy className="h-8 w-8" />}
            color="bg-gradient-to-r from-green-500 to-green-600"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sports.map((member, index) => (
              <MemberCard key={`sports-${index}`} member={member} index={index} />
            ))}
          </div>
        </section>

        {/* House System */}
        <section className="mb-20">
          <SectionHeader 
            title="House System" 
            subtitle="Building unity through healthy competition"
            icon={<Users className="h-8 w-8" />}
            color="bg-gradient-to-r from-orange-500 to-orange-600"
          />
          
          {/* Yellow House */}
          <div className="mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 px-6 py-3 rounded-full">
                <h3 className="text-xl font-bold text-white">Yellow House</h3>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {yellowHouse.map((member, index) => (
                <MemberCard key={`yellowHouse-${index}`} member={member} index={index} />
              ))}
            </div>
            {yellowHouse.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Captain position available</p>
              </div>
            )}
          </div>

          {/* Green House */}
          <div className="mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-r from-green-400 to-green-600 px-6 py-3 rounded-full">
                <h3 className="text-xl font-bold text-white">Green House</h3>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              {greenHouse.map((member, index) => (
                <MemberCard key={`greenHouse-${index}`} member={member} index={index} />
              ))}
            </div>
          </div>

          {/* Red House */}
          <div className="mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-r from-red-400 to-red-600 px-6 py-3 rounded-full">
                <h3 className="text-xl font-bold text-white">Red House</h3>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              {redHouse.map((member, index) => (
                <MemberCard key={`redHouse-${index}`} member={member} index={index} />
              ))}
            </div>
          </div>

          {/* Blue House */}
          <div className="mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-r from-blue-400 to-blue-600 px-6 py-3 rounded-full">
                <h3 className="text-xl font-bold text-white">Blue House</h3>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              {blueHouse.map((member, index) => (
                <MemberCard key={`blueHouse-${index}`} member={member} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Activity Incharges */}
        <section className="mb-20">
          <SectionHeader 
            title="Activity Coordinators" 
            subtitle="Enriching school life through diverse activities"
            icon={<Music className="h-8 w-8" />}
            color="bg-gradient-to-r from-pink-500 to-pink-600"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {activities.map((member, index) => (
              <MemberCard key={`activities-${index}`} member={member} index={index} />
            ))}
          </div>
        </section>

        {/* Closing Message */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-3xl p-12"
        >
          <Star className="h-12 w-12 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Together We Rise</h2>
          <p className="text-xl opacity-90 max-w-3xl mx-auto leading-relaxed">
            Our student council represents the voice of every student at Rajhans Public School. 
            Through leadership, dedication, and teamwork, we strive to create an environment where 
            every student can thrive and achieve their fullest potential.
          </p>
        </motion.section>
      </div>
    </div>
  );
};

export default StudentCouncil;